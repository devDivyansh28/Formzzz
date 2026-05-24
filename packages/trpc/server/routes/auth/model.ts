import {z} from "zod";


export const createUserWithEmailAndPasswordInputModel= z.object({
    fullName : z.string().describe("Name of the User"),
    email: z.email().describe("Email fo the User"),
    password: z.string().describe("Password of the User"),
})


export const createUserWithEmailAndPasswordOutputModel = z.object({
    id : z.string().describe("id of the User Created")
})