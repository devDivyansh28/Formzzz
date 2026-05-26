import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"

import { useLogin } from "~/hooks/api/auth"

import { useForm ,} from "react-hook-form"

import {useRouter} from "next/navigation"

type LoginFormValues = {
  email: string;
  password: string;
};


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  
   const {loginUserWithEmailAndPasswordAsync} = useLogin()
   const {
     register,
     handleSubmit,
     setError,
     formState: { errors, isSubmitting },
     reset,
   } = useForm<LoginFormValues>({
    defaultValues : {
      email : "",
      password : ""
    },
    mode : "onSubmit"
   })

   const onSubmit = async (values: LoginFormValues)=>{
    try{
      const {id} = await loginUserWithEmailAndPasswordAsync({email : values.email , password : values.password});
      console.log(`Id Recieved is ${id}`)
      router.replace("/dashboard");

    }catch(error : any){
     if (error.name === "email") {
       setError("email", {
         type: "server",
         message: error.message,
       });
     }

     if (error.name === "password") {
       setError("password", {
         type: "server",
         message: error.message,
       });
     }
    }
    reset();
   }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is Required",
                  })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is Required",
                  })}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
