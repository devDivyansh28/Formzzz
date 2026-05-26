import {z} from "zod";


export const createUserWithEmailAndPasswordInputModel= z.object({
    fullName : z.string().describe("Name of the User"),
    email: z.email().describe("Email fo the User"),
    password: z.string().describe("Password of the User"),
})


export const createUserWithEmailAndPasswordOutputModel = z.object({
    id : z.string().describe("id of the User Created")
})

export const loginUserWithEmailAndPasswordInputModel = z.object({
    email : z.email().describe("Email of the User"),
    password : z.string().describe("Password of the User")
})

export const loginUserWithEmailAndPasswordOutputModel = z.object({
   id : z.string().describe("Id of the User")
})

export const verifyUserWithTokenInputModel = z.undefined()

export const verifyUserWithTokenOutputModel = z.object({
    id : z.string("UUID of the User")
     , email : z.email().describe("Email of the User")
      , fullName : z.string().describe("Full Name of the User") ,
       profileImageUrl : z.string().describe("Profile Image Url of the User").optional().nullable()
})