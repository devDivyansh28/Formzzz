
import { db , eq} from "@repo/database";
import { CreateFormInputType , createFormInput } from "./model";

import {formTable} from "@repo/database/models/form"


 class FormService {

    public async createForm(payload : CreateFormInputType){
     const {title , description , createdBy}= await createFormInput.parseAsync(payload);

     const existingTitle = await db.select({title : formTable.title }).from(formTable).where(eq(formTable.id , createdBy))
     if(existingTitle.length !== 0) throw new Error("Table with this title Already Exists")

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
}

export default FormService