import {createHmac, randomBytes} from "node:crypto"
import {db , eq} from "@repo/database"
import {usersTable} from "@repo/database/models/user"

import {type CreateUserWithEmailAndPasswordInputType , GenerateUserTokenPayloadType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, loginUserWithEmailAndPasswordInput, LoginUserWithEmailAndPasswordInputType} from "./model"
import { create } from "node:domain";
import * as JWT from "jsonwebtoken"
import {env} from "../env"

class UserService {

  private async getUserByEmail(email: string){
    const result = await db.select().from(usersTable).where(eq(usersTable.email,email));
    if(!result || result.length===0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType){
  
    const {id} = await generateUserTokenPayload.parseAsync(payload);

   const token =   JWT.sign({id}, env.JWT_SECRET )

   return {token}
    
  } 

  private async generateHash(password : string , salt : string){
    return  createHmac('sha256',salt).update(password).digest('hex');
  }
  
  private async verifyUserToken(token : string): Promise<GenerateUserTokenPayloadType> {
    try{
       return JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType
    }catch(error){
      throw new Error("Invalid Token Please Register Again !!!")
    }
    
  }

  private async getUserById(id : string){
    const response = await db.select(
      {id : usersTable.id,
       email : usersTable.email,
       fullName : usersTable.fullName,
       profileImageUrl : usersTable.profileImageUrl
      }

    ).from(usersTable).where(eq(usersTable.id , id))

    if(!response || response.length===0)  throw new Error("Something went wrong !!!");

    return response[0]!;
  }

  public async createUserWithEmailAndPassword(payload : CreateUserWithEmailAndPasswordInputType){
     
    const {fullName , email , password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)

// Check if User exists or nto
    const existingUserWithEmail = await this.getUserByEmail(email);

    if(existingUserWithEmail) throw new Error(`user with Email ${email} already exists`);

    const salt = randomBytes(16).toString('hex') // Or we can have bcryptjs for hashing the password then storing it in the database

    
    const hash = await this.generateHash(password,salt);

    const userInsertResult = await db.insert(usersTable).values({email , fullName , password : hash , salt}).returning({
        id : usersTable.id
    })
    

    if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error(`Something went wrong while Createing a User`)

    const userId = userInsertResult[0]?.id

    const {token} = await this.generateUserToken({id : userId})
    
    return {
       id :  userId,
       token
    }
  }


  public async loginUserWithEmailAndPassword(payload : LoginUserWithEmailAndPasswordInputType){
    // Validation of the data
    const {email , password} = await loginUserWithEmailAndPasswordInput.parseAsync(payload);

    // Check if User had registered or not
    const existingUser = await this.getUserByEmail(email);
    if(!existingUser) throw new Error("Please Register Before Login")
    
      if(!existingUser.password || !existingUser.salt){
        throw new Error("Invalid Authentication Method! Please Login with Correct Method")
      }
      
     const hash = await this.generateHash(password,existingUser.salt);

     if(hash !== existingUser.password){
      throw new Error("Wrong Credentials! Better Luck Next Time")
     }
     
     
      const userId = existingUser.id;
      const {token} = await this.generateUserToken({id : userId});

      return {
        id : userId,
        token
      }

  }

  public async verifyAndDecodeUserToken(token : string){
    
     const {id} = await this.verifyUserToken(token)

    
     const userInfo = await this.getUserById(id)


     return {...userInfo}

    
  }

}

export default UserService;