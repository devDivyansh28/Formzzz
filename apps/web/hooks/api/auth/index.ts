import { trpc } from "~/trpc/client"

export const useSignup = ()=>{
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate : createUserWithEmailAndPassword,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        status
        
        
    } = trpc.auth.createUserWithEmailAndPassword.useMutation()

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        status 
    }
}