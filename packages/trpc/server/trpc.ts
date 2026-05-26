import { initTRPC, TRPCError ,  } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { userService } from "./services";
import { getAuthenticationCookie } from "./utils/cookie";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use( async options => {
  const {ctx} = options

  const token = getAuthenticationCookie(ctx)
  if(!token) throw new Error("Please Login Before !!!")

  const {id} = await userService.verifyAndDecodeUserToken(token)

  return options.next({
    ctx : {
      ...ctx,
      user : {
        id
      }

    }
  })

})
