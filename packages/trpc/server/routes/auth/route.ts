 
 
import { publicProcedure , router }from "../../trpc"; 
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

import {createUserWithEmailAndPasswordOutputModel , createUserWithEmailAndPasswordInputModel, loginUserWithEmailAndPasswordInputModel, loginUserWithEmailAndPasswordOutputModel, verifyUserWithTokenInputModel, verifyUserWithTokenOutputModel} from "./model"
import { userService } from "../../services";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
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
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { id, token } = await userService.loginUserWithEmailAndPassword({ email, password });

      setAuthenticationCookie(ctx, token);
      return {
        id,
      };
    }),

  verifyAndDecodeUserToken: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/verifyAndDecodeUserToken"),
        tags: TAGS,
      },
    })
    .input(verifyUserWithTokenInputModel)
    .output(verifyUserWithTokenOutputModel)
    .query(async ({ctx})=>{
      
      const token = getAuthenticationCookie(ctx)

      if(!token) throw new Error("Something went wrong Please Register Again !!!")

      const {id , email , fullName , profileImageUrl} = await userService.verifyAndDecodeUserToken(token)
      return {
        id,
        email,
        fullName,
        profileImageUrl
      }
    }),
});
