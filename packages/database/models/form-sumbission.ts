import { uuid , timestamp , text , json } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { formTable } from "./form";
import { formFieldTable } from "./form-field";



export interface FormSubmissionValue {
    formFieldId : string
    value : string
}

export type FormSubmissionValueRow = FormSubmissionValue[]


export const formSubmissionTable = pgTable("form_submission",{
        id : uuid("id").primaryKey().defaultRandom(),
        formId : uuid("form_id").references(()=>formTable.id).notNull(),
        // fieldId : uuid("field_id").references(()=>formFieldTable.id).notNull(),

       values : json('values').$type<FormSubmissionValueRow>(),
       
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

})