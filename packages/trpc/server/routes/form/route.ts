import { formService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listAllFormsInputModel, listAllFormsOutputModel } from "./model";


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
    .query(async ({ctx} )=> {
         
       const id = ctx.user.id

       const allForms = await formService.listAllForms({id})

       return allForms

    }),
});