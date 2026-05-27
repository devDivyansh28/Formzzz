import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignup } from "~/hooks/api/auth";
import Link from "next/link";
import {useRouter} from "next/navigation"
type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};



export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const router = useRouter();
 
  const {
    createUserWithEmailAndPasswordAsync
  } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  /**
   * Production-grade submit handler
   * - fully typed
   * - async-ready
   * - safe error handling
   * - easy to extend for API integration
   */
  const onSubmit = async (values: SignupFormValues) => {
    try {
      console.log("Signup Form Submitted:", values);
      const {id } = await createUserWithEmailAndPasswordAsync({fullName : values.name , email : values.email , password : values.password} )
      router.replace("/dashboard");
      console.log(id)

      // Example future API call:
      // await authService.signup(values)

      reset();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>

              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name", {
                  required: "Full name is required",
                })}
              />

              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />

              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email with anyone else.
              </FieldDescription>

              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />

              <FieldDescription>Must be at least 8 characters long.</FieldDescription>

              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </Field>

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
