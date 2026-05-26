import { formService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel } from "./model";


const TAGS = ["FormService"];
const getPath = generatePath("/formservice");


export const formServiceRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({input , ctx})=>{

        const {title , description} = input
        const id = ctx.user.id

        if(!id) throw new Error("Something Went Wrong Please Login Again")

        const {formId} = await formService.createForm({title , description , createdBy : id})
        
        return {
            formId
        }
    }
    ),
});