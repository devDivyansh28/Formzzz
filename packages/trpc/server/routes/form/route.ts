import { updateFieldInput } from "@repo/services/form/model";
import { formService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createFormFieldInputModel, createFormFieldOutputModel, createFormInputModel, createFormOutputModel, deleteFieldInputModel, deleteFieldOutputModel, getAllFieldInputModel, getAllFieldOutputModel, getFormInputModel, getFormOutputModel, getFormSubmissionsInputModel, getFormSubmissionsOutputModel, listAllFormsInputModel, listAllFormsOutputModel, submitFormInputModel, submitFormOutputModel, updateFormFieldInputModel, updateFormFieldOutputModel } from "./model";


const TAGS = ["FormService"];
const getPath = generatePath("/formservice");


export const formServiceRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;
      const id = ctx.user.id;

      if (!id) throw new Error("Something Went Wrong Please Login Again");

      const { formId } = await formService.createForm({ title, description, createdBy: id });

      return {
        formId,
      };
    }),

  listAllForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listAllForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listAllFormsInputModel)
    .output(listAllFormsOutputModel)
    .query(async ({ ctx }) => {
      const id = ctx.user.id;

      const allForms = await formService.listAllForms({ id });

      return allForms;
    }),

  createFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, label, description, isRequired, type, placeholder } = input;

      const { fieldId, labelKey, index } = await formService.createFormField({
        formId,
        label,
        description,
        isRequired,
        type,
        placeholder,
      });

      return {
        fieldId,
        labelKey,
        index,
      };
    }),

  updateFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormFieldInputModel)
    .output(updateFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fieldId } = await formService.updateFormField(input);

      return {
        fieldId,
      };
    }),

  getAllField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getAllField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getAllFieldInputModel)
    .output(getAllFieldOutputModel)
    .mutation(async ({ input }) => {
      const { formId } = input;
      const allFields = await formService.getAllField({ formId });

      return allFields;
    }),

  deleteFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { fieldId } = input;

      return await formService.deleteFormField({ fieldId });
    }),

  getForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getForm"),
        tags: TAGS,
      },
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ input }) => {
      return formService.getFormById({ formId: input.formId });
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      return formService.submitForm(input);
    }),

  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
        protect : true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({input})=>{
      const response = await formService.getSubmissions({formId : input.formId})

      return response
    })
});