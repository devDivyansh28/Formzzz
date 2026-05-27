import {z } from 'zod';

export const createFormInput = z.object({
    title : z.string().max(55).describe("Title of the Form"),
    description : z.string().max(300).describe("Description of the Form ").optional().nullable(),
    createdBy : z.string().uuid().describe("Id of the Form Creator")
})

export const listAllFormsInput = z.object({
    id : z.string().uuid().describe("Id of the Form Creator")
})

export const createFormFieldInput = z.object({
  label: z.string().min(1).max(100).trim().describe("Field Label"),
  description: z.string().trim().optional().nullable().describe("Description of the Field"),
  placeholder: z.string().trim().optional().nullable().describe("Placeholder of the Field"),
  isRequired: z.boolean().default(false).describe("Is field required"),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type"),
  formId: z.string().uuid().describe("Id of the Form of which this field belong to"),
});

export const updateFieldInput = z.object({
  fieldId: z.string().uuid().describe("Id of the Field"),
  label: z.string().min(1).max(100).trim().describe("Field Label").optional(),
  description: z.string().trim().optional().nullable().describe("Description of the Field"),
  placeholder: z.string().trim().optional().nullable().describe("Placeholder of the Field"),
  isRequired: z.boolean().describe("Is field required").optional(),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type").optional(),
});


export const deleteFieldInput = z.object({
  fieldId: z.string().uuid().describe("Id of the Field"),
});

export const getAllFieldInput = z.object({
  formId: z.string().uuid().describe("form id"),
});

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("form id"),
});



export const submitFormInput = z.object({
  formId : z.string()
.uuid().describe('UUID of the form being submitted'),
values : z.array(
  z.object({
    formFieldId : z.string().uuid().describe('UUID of the form field'),
    value : z.string().describe('Value submitted for the form field')
  })).min(1).describe('Array of form field values being submitted')
})

export const getSubmissionsInput = z.object({
  formId : z.string().uuid().describe('UUID of the form for which submissions are being retrieved')
})


export type GetSubmissionsInputType = z.infer<typeof getSubmissionsInput>

export type SubmitFormInputType = z.infer<typeof submitFormInput>

export type ListAllFormsInputType = z.infer<typeof listAllFormsInput>
export type CreateFormInputType = z.infer<typeof createFormInput>

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>

export type GetAllFieldInputType = z.infer<typeof getAllFieldInput>

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>