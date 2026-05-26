import {z} from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName : z.string().describe("Full Name of User"),
    email : z.email().describe('email address of the user'),
    password : z.string().describe("Password of the User")
})


export const generateUserTokenPayload = z.object({
    id : z.string().describe("UUID of User")
})

export const loginUserWithEmailAndPasswordInput = z.object({
    email : z.email().describe("Email of User"),
    password : z.string().describe("Password of Account")
})





export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export type GenerateUserTokenPayloadType =  z.infer<typeof generateUserTokenPayload>

export type LoginUserWithEmailAndPasswordInputType = z.infer<typeof loginUserWithEmailAndPasswordInput>