"use client"
import { LoginForm } from "~/components/login-form"

export default function Page() {
  return (
    <div className="cascade-page cascade-hero flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="cascade-hero-stripe cascade-animated absolute inset-0" />
      <div className="cascade-depth-layer one" />
      <div className="cascade-depth-layer two" />
      <div className="cascade-depth-layer three" />
      <div className="scroll-reveal relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
