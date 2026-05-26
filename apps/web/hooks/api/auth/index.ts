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

export const useLogin = ()=>{
    const {
        mutateAsync : loginUserWithEmailAndPasswordAsync,
        mutate : loginUserWithEmailAndPassword,
        isError,
        isIdle,
        failureCount,
        isSuccess,
        status

    } = trpc.auth.loginUserWithEmailAndPassword.useMutation()

    return {
      loginUserWithEmailAndPasswordAsync,
      loginUserWithEmailAndPassword,
      isError,
      isIdle,
      failureCount,
      isSuccess,
      status,
    };
}