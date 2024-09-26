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
import { signupSchema } from "@/schemas/signupSchema"
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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
    const [username, setUsername] = useState("")
    const [usernameMsg, setUsernameMsg] = useState("") // from backend
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)

    // form state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // sending request to backend to check if username is available continous
    const debounded = useDebounceCallback(setUsername, 300) // 300ms debounce
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMsg("")

                try {
                    const response = await axios.get(`/api/check-username?username=${username}`)
                    setUsernameMsg(response.data.message)
                } catch (error) {
                    const errorMessage = error
                    setUsernameMsg(errorMessage.response.data.message)
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsername();
    }, [username])

    const onSubmit = async (data) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post("/api/sign-up", data)
            toast({
                title: "Account created",
                description: response.data.message,
                status: "success"
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            const errorMessage = error.response.data.message
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen justify-center items-center">
            <div className="w-1/4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Signup for your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        placeholder="username"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                            debounded(e.target.value);
                                                        }}
                                                    />
                                                    {isCheckingUsername && (
                                                        <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" />
                                                    )}
                                                    <p
                                                        className={`text-sm ${usernameMsg === "Username already exists"
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                            }`}
                                                    >
                                                        {usernameMsg}
                                                    </p>
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email" {...field} />
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
                                    </>) : "Sign Up"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter>
                        <div className="flex gap-2">
                            <p>Already a member?</p>
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}