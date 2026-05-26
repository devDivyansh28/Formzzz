import { trpc } from "~/trpc/client"

export const useSignup = ()=>{

    const utils = trpc.useUtils()
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate : createUserWithEmailAndPassword,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        status
        
        
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess : 
            async ()=>{
                await utils.auth.verifyAndDecodeUserToken.invalidate()
            }
        
    })

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

    const utils = trpc.useUtils();
    const {
      mutateAsync: loginUserWithEmailAndPasswordAsync,
      mutate: loginUserWithEmailAndPassword,
      isError,
      isIdle,
      failureCount,
      isSuccess,
      status,
    } = trpc.auth.loginUserWithEmailAndPassword.useMutation({
      onSuccess: async () => {
        await utils.auth.verifyAndDecodeUserToken.invalidate();
      },
    });

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

export const getUser = ()=>{
    const {
        data : userInfo,
        dataUpdatedAt,
        failureCount,
        isError,
        isFetched,
        isLoading,
        isPaused,
        isSuccess,
        status
    } = trpc.auth.verifyAndDecodeUserToken.useQuery()
    return {
      userInfo,
      dataUpdatedAt,
      failureCount,
      isError,
      isFetched,
      isLoading,
      isPaused,
      isSuccess,
      status,
    };
}