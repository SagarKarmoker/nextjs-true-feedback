"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

export default function SigninPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (response.error) {
      toast({
        title: "Login Error",
        description: response.error,
        status: "error",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }

    if (response.url) {
      toast({
        title: "Success",
        description: "You have successfully signed in",
        status: "success",
      })
      setIsSubmitting(false)
      router.replace("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="w-1/4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Username</FormLabel>
                      <FormControl>
                        <Input placeholder="email/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (<>
                    <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" /> Submitting
                  </>) : "Signin"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <p>Dont have an account?</p>
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}