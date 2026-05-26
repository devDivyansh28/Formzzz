import {z} from "zod"


export const createFormInputModel = z.object({
  title: z.string().max(55).describe("Title of the Form"),
  description: z.string().max(300).describe("Description of the Form ").optional().nullable()
});

export const createFormOutputModel = z.object({
    formId : z.string().describe("Id of the Form Created !!!")
})