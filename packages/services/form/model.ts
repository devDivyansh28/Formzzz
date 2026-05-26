import {z} from 'zod';

export const createFormInput = z.object({
    title : z.string().max(55).describe("Title of the Form"),
    description : z.string().max(300).describe("Description of the Form ").optional().nullable(),
    createdBy : z.string().uuid().describe("Id of the Form Creator")
})

export const listAllFormsInput = z.object({
    id : z.string().uuid().describe("Id of the Form Creator")
})

export type ListAllFormsInputType = z.infer<typeof listAllFormsInput>
export type CreateFormInputType = z.infer<typeof createFormInput>