 
 
import { publicProcedure , router }from "../../trpc"; 
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

import {createUserWithEmailAndPasswordOutputModel , createUserWithEmailAndPasswordInputModel, loginUserWithEmailAndPasswordInputModel, loginUserWithEmailAndPasswordOutputModel} from "./model"
import { userService } from "../../services";
import { setAuthenticationCookie } from "../../utils/cookie";
import { loginUserWithEmailAndPasswordInput } from "@repo/services/user/model";



export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  loginUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/loginUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(loginUserWithEmailAndPasswordInputModel)
    .output(loginUserWithEmailAndPasswordOutputModel)
    .mutation(
      async ({input,ctx})=>{

        const {email , password} = input
        const {id , token} = await userService.loginUserWithEmailAndPassword({email , password})
        
        setAuthenticationCookie(ctx , token);
        return {
          id
        }

      }

    ),
});
