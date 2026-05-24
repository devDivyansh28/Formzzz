import {z} from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName : z.string().describe("Full Name of User"),
    email : z.email().describe('email address of the user'),
    password : z.string().describe("Password of the User")
})


export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>