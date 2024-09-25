"use client"
import { useToast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { verifySchema } from '@/schemas/verifySchema'
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
import axios from 'axios'

export default function VerifyOTP() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(verifySchema),

  })

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code
      })

      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
      })

      router.replace("/sign-in")
    } catch (error) {
      const errorMessage = error.response.data.message
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        variant: "destructive"
      })
    }
  }

  return (
    <div>
      <div>
        <h1>Verify OTP</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="6 digit code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
