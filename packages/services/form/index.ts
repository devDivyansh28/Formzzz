
import { db , eq , and} from "@repo/database";
import { CreateFormInputType , ListAllFormsInputType, createFormInput, listAllFormsInput } from "./model";

import {formTable} from "@repo/database/models/form"


 class FormService {

    public async createForm(payload : CreateFormInputType){
     const {title , description , createdBy}= await createFormInput.parseAsync(payload);

     const existingTitle = await db.select({title : formTable.title }).from(formTable).where(and(eq(formTable.createdBy , createdBy),eq(formTable.title , title)))
     if(existingTitle[0]?.title===title) throw new Error("Table with this title Already Exists");

   //   if(existingTitle.length !== 0) throw new Error("Table with this title Already Exists")

     const formCreateResult = await db.insert(formTable).values({title , description , createdBy}).returning(
        {
            id : formTable.id
        }
     )
    
     if(!formCreateResult || formCreateResult.length===0 || !formCreateResult[0]?.id){
        throw new Error("Something Went Wrong While Creating Form!!!")
     }

     const formid = formCreateResult[0].id;

     return {
        formId : formid
     }

    }

    public async listAllForms(payload : ListAllFormsInputType){

     const { id } = await listAllFormsInput.parseAsync(payload);
     
     const allForms = await db.select({
      formId : formTable.id,
      title : formTable.title,
      description : formTable.description
     }).from(formTable).where(eq(formTable.createdBy,id));

     if(!allForms) throw new Error("Something Went Wrong !!!")

      return allForms

    }
}

export default FormService