"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function MessageCard({ message, onMessageDelete }) {

    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`/api/delete-msg/${message._id}`) // mongodb id
            toast({
                title: "Message deleted",
                description: "Your message has been deleted",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            onMessageDelete(message._id)
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "There was an error deleting your message",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </>
    )
}
