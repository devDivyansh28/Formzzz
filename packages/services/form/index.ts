
import { db , eq , and , max, asc ,desc} from "@repo/database";
import { CreateFormFieldInputType, CreateFormInputType , DeleteFieldInputType, GetAllFieldInputType, GetFormByIdInputType, GetSubmissionsInputType, ListAllFormsInputType, SubmitFormInputType, UpdateFieldInputType, createFormFieldInput, createFormInput, deleteFieldInput, getAllFieldInput, getFormByIdInput, getSubmissionsInput, listAllFormsInput, submitFormInput, updateFieldInput } from "./model";

import {formTable} from "@repo/database/models/form"

import {formFieldTable} from "@repo/database/models/form-field"

import {formSubmissionTable} from "@repo/database/models/form-sumbission"




 class FormService {
   private async getNextIndex(formId: string): Promise<string> {
     const result = await db
       .select({ maxIndex: max(formFieldTable.index) })
       .from(formFieldTable)
       .where(eq(formFieldTable.formId, formId));

     const currentIndex = result[0]?.maxIndex;
     const nextIndex = currentIndex ? parseFloat(currentIndex) + 1 : 1;

     return nextIndex.toFixed(2);
   }

   private toLableKey(label: string): string {
     return label
       .trim()
       .toLowerCase()
       .replace(/[^a-z0-9\s]/g, "")
       .replace(/\s+/g, "_");
   }

   public async createForm(payload: CreateFormInputType) {
     const { title, description, createdBy } = await createFormInput.parseAsync(payload);

     const existingTitle = await db
       .select({ title: formTable.title })
       .from(formTable)
       .where(and(eq(formTable.createdBy, createdBy), eq(formTable.title, title)));
     if (existingTitle[0]?.title === title) throw new Error("Table with this title Already Exists");

     //   if(existingTitle.length !== 0) throw new Error("Table with this title Already Exists")

     const formCreateResult = await db
       .insert(formTable)
       .values({ title, description, createdBy })
       .returning({
         id: formTable.id,
       });

     if (!formCreateResult || formCreateResult.length === 0 || !formCreateResult[0]?.id) {
       throw new Error("Something Went Wrong While Creating Form!!!");
     }

     const formid = formCreateResult[0].id;

     return {
       formId: formid,
     };
   }

   public async listAllForms(payload: ListAllFormsInputType) {
     const { id } = await listAllFormsInput.parseAsync(payload);

     const allForms = await db
       .select({
         formId: formTable.id,
         title: formTable.title,
         description: formTable.description,
       })
       .from(formTable)
       .where(eq(formTable.createdBy, id));

     if (!allForms) throw new Error("Something Went Wrong !!!");

     return allForms;
   }

   public async createFormField(payload: CreateFormFieldInputType) {
     const { label, isRequired, type, formId, description, placeholder } =
       await createFormFieldInput.parseAsync(payload);

     const index = await this.getNextIndex(formId);
     const label_key = await this.toLableKey(label);

     const existing = await db
       .select({ labelKey: formFieldTable.labelKey })
       .from(formFieldTable)
       .where(and(eq(formFieldTable.formId, formId), eq(formFieldTable.labelKey, label_key)));

     if (existing.length !== 0) {
       throw new Error("Field with similar label already exists");
     }

     const response = await db
       .insert(formFieldTable)
       .values({
         label,
         isRequired,
         type,
         formId,
         description,
         placeholder,
         labelKey: label_key,
         index,
       })
       .returning({
         fieldId: formFieldTable.id,
         labelKey: formFieldTable.labelKey,
         index: formFieldTable.index,
       });

     if (!response || response.length === 0 || !response[0]?.fieldId)
       throw new Error("Something Went wrong while creating this field...");

     return {
       fieldId: response[0].fieldId,
       labelKey: response[0].labelKey,
       index: response[0].index,
     };
   }

   public async updateFormField(payload: UpdateFieldInputType) {
     const toUpdate = await updateFieldInput.parseAsync(payload);

     const { fieldId, ...updateRequest } = toUpdate;

     const updateData = Object.fromEntries(
       Object.entries(updateRequest).filter(([_, value]) => value !== undefined),
     );

     if (Object.keys(updateData).length === 0) {
       throw new Error("No fields provided for update");
     }

     const response = await db
       .update(formFieldTable)
       .set(updateData)
       .where(eq(formFieldTable.id, fieldId))
       .returning({
         fieldId: formFieldTable.id,
       });

     if (!response[0]?.fieldId) {
       throw new Error("Updation failed...");
     }

     return {
       fieldId: response[0].fieldId,
     };
   }

   public async deleteFormField(payload: DeleteFieldInputType) {
     const { fieldId } = await deleteFieldInput.parseAsync(payload);

     const response = await db
       .delete(formFieldTable)
       .where(eq(formFieldTable.id, fieldId))
       .returning({
         fieldId: formFieldTable.id,
       });

     if (!response || response.length === 0 || !response[0]?.fieldId)
       throw new Error("Something went wrong while deleting this field!!!");

     return {
       fieldId: response[0].fieldId,
     };
   }

   public async getAllField(payload: GetAllFieldInputType) {
     const { formId } = await getAllFieldInput.parseAsync(payload);

     const allFields = await db
       .select({
         fieldId: formFieldTable.id,
         formId: formFieldTable.formId,
         label: formFieldTable.label,
         placeholder: formFieldTable.placeholder,
         type: formFieldTable.type,
         description: formFieldTable.description,
         isRequired: formFieldTable.isRequired,
       })
       .from(formFieldTable)
       .where(eq(formFieldTable.formId, formId));

     if (!allFields) throw new Error("Something Went Wrong !!!");

     return allFields;
   }


   public async getFormById(payload : GetFormByIdInputType){

    const {formId} = await getFormByIdInput.parseAsync(payload)
    
    const rows = await db.select({
      id : formTable.id,
      title : formTable.title,
      description : formTable.description,
      createdAt : formTable.createdAt,
      updatedAt : formTable.updatedAt,
      field : {
        id : formFieldTable.id,
        label : formFieldTable.label,
        labelKey : formFieldTable.labelKey,
        placeholder : formFieldTable.placeholder,
        type : formFieldTable.type,
        isRequired : formFieldTable.isRequired,
        index : formFieldTable.index
      }
    }).from(formTable)
    .leftJoin(formFieldTable,eq(formFieldTable.formId , formTable.id))
    .where(eq(formTable.id,formId))
    .orderBy(asc(formFieldTable.index))

    if(rows.length === 0) return null

    const {id, title, description,createdAt, updatedAt} = rows[0]!
    
    const fields = rows
      .filter(r => r.field?.id !== null)
      .map(r => r.field as NonNullable<typeof r.field>)

      return {id , title , description , createdAt , updatedAt , fields}

   }
  
   public async submitForm(payload : SubmitFormInputType){
    const {formId , values} = await submitFormInput.parseAsync(payload)

    const result = await db.insert(formSubmissionTable)
    .values({formId , values})
    .returning({id : formSubmissionTable.id})

    if(!result || result.length===0 || !result[0]?.id)
       throw new Error("Something went wrong while saving your submission")

    return {id: result[0].id}
   }

   public async getSubmissions(payload : GetSubmissionsInputType){
    const {formId} = await getSubmissionsInput.parseAsync(payload);

    const result = await db.select(
      {
        id : formSubmissionTable.id,
        values : formSubmissionTable.values,
        createdAt : formSubmissionTable.createdAt
      }
    ).from(formSubmissionTable).where(eq(formSubmissionTable.formId,formId))
    .orderBy(desc(formSubmissionTable.createdAt))
    

    return result;

   }

   

 }

export default FormService