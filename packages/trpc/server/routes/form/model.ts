import { submitFormInput } from "@repo/services/form/model";
import { z } from "zod";



export const createFormInputModel = z.object({
  title: z.string().max(55).describe("Title of the Form"),
  description: z.string().max(300).describe("Description of the Form ").optional().nullable(),
});

export const createFormOutputModel = z.object({
  formId: z.string().describe("Id of the Form Created !!!"),
});

export const listAllFormsInputModel = z.undefined();
export const listAllFormsOutputModel = z.array(
  z.object({
    formId: z.string().uuid().describe("Form ID "),
    title: z.string().describe("Title of the Form"),
    description: z.string().describe("Description of the form").optional().nullable(),
  }),
);

export const createFormFieldInputModel = z.object({
  label: z.string().min(1).max(100).trim().describe("Field Label"),
  description: z.string().trim().optional().nullable().describe("Description of the Field"),
  placeholder: z.string().trim().optional().nullable().describe("Placeholder of the Field"),
  isRequired: z.boolean().default(false).describe("Is field required"),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type"),
  formId: z.string().uuid().describe("Id of the Form of which this field belong to"),
});

export const createFormFieldOutputModel = z.object({
  fieldId: z.string().uuid().describe("Id of the Field Created"),
  labelKey: z.string().describe("Label key of the field created"),
  index: z.string(),
});

export const updateFormFieldInputModel = z.object({
  fieldId: z.string().uuid().describe("Id of the Field"),
  label: z.string().min(1).max(100).trim().describe("Field Label").optional(),
  description: z.string().trim().optional().nullable().describe("Description of the Field"),
  placeholder: z.string().trim().optional().nullable().describe("Placeholder of the Field"),
  isRequired: z.boolean().default(false).describe("Is field required").optional(),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type").optional(),
});

export const updateFormFieldOutputModel = z.object({
  fieldId: z.string().describe("Id of the Field Updated"),
});

export const getAllFieldInputModel = z.object({
  formId: z.string().uuid().describe("Id of the Form"),
});

export const getAllFieldOutputModel = z.array(
  z.object({
    label: z.string().min(1).max(100).trim().describe("Field Label"),
    description: z.string().trim().optional().nullable().describe("Description of the Field"),
    placeholder: z.string().trim().optional().nullable().describe("Placeholder of the Field"),
    isRequired: z.boolean().default(false).describe("Is field required"),
    type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type"),
    formId: z.string().uuid().describe("Id of the Form of which this field belong to"),
    fieldId: z.string().uuid().describe("Field Id of each field"),
  }),
);

export const deleteFieldInputModel = z.object({
  fieldId: z.string().uuid().describe("Id of the Field"),
});

export const deleteFieldOutputModel = z.object({
  fieldId: z.string().uuid().describe("Id of the Field"),
});


const formFieldObject = z.object({
  id : z.string().describe('ID of the field'),
  label : z.string().describe('Display Label'),
  labelKey : z.string().describe('Immutable slug key'),
  type : z.enum(['TEXT','NUMBER','EMAIL',"YES_NO",'PASSWORD']),
  description : z.string().nullable().optional(),
  placeholder : z.string().nullable().optional(),
  isRequired : z.boolean(),
  index : z.string().describe('Fractional index for ordering')
})

export const getFieldsOutputModel = z.array(formFieldObject)

export const getFormInputModel = z.object({
  formId : z.string().uuid().describe('UUID of the Form'),
})

export const getFormOutputModel = z.object({
  id : z.string(),
  title : z.string(),
  description : z.string().nullable().optional(),
  createdAt : z.date().nullable(),
  updatedAt : z.date().nullable(),
  fields : z.array(formFieldObject),

}).nullable()

export const submitFormInputModel = z.object({
    formId : z.string().uuid().describe('UUID of the form'),
    values : z.array(z.object({
      formFieldId : z.string().uuid(),
      value : z.string()
    })).min(1)
})

export const submitFormOutputModel = z.object({
  id : z.string().describe('ID of the created Submission')
})

export const getFormSubmissionsInputModel = z.object({
  formId : z.string().uuid().describe('UUID of the form'),
})

export const getFormSubmissionsOutputModel = z.array(z.object({
  id : z.string(),
  createdAt : z.date().nullable(),
  values : z.array(z.object({
    formFieldId : z.string(),
    value : z.string(),
  })).nullable()
}))