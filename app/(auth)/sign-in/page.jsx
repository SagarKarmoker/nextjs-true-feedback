"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios from "axios"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (<>
              <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" /> Submitting
            </>) : "Signin"}
          </Button>
        </form>
      </Form>

      <div>
        <p>Already a member?</p>
        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </div>
    </div>
  )
}