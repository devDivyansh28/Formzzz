import {z} from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName : z.string().describe("Full Name of User"),
    email : z.email().describe('email address of the user'),
    password : z.string().describe("Password of the User")
})


export const generateUserTokenPayload = z.object({
    id : z.string().describe("UUID of User")
})


export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export type GenerateUserTokenPayloadType =  z.infer<typeof generateUserTokenPayload>