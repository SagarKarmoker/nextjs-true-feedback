"use client"
import { useToast } from '@/hooks/use-toast'
import { acceptMsgSchema } from '@/schemas/acceptMsgSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Dashboard() {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { toast } = useToast()

    // optimistic ui update
    const handleDeleteMessage = async (messageId) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    // is user logged in
    const { data: session } = useSession()

    // validation
    const form = useForm({
        resolver: zodResolver(acceptMsgSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch("acceptMessages")

    // backend
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept-msg')
            setValue("acceptMessages", response.data.isAcceptingMsg)
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error'
            })
        } finally {
            setIsSwitchLoading(false)
        }

    }, [setValue])

    const fetchMessages = useCallback(async (refresh = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/get-msges')
            setMessages(response.data.messages)

            if (refresh) {
                toast({
                    title: 'Refreshed messages',
                    description: 'Messages refreshed',
                    status: 'success'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error'
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return

        fetchAcceptMessages();
        fetchMessages();

    }, [session, setValue, fetchAcceptMessages, fetchMessages])

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true)
        try {
            await axios.post('/api/accept-msg', { isAcceptingMsg: !acceptMessages })
            setValue("acceptMessages", !acceptMessages)
            toast({
                title: 'Message accept status changed',
                description: `Messages are now ${!acceptMessages ? 'enabled' : 'disabled'}`,
                status: 'success'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error'
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }

    // if user is not logged in
    if (!session || !session.user) {
        return <div>Not logged in</div>
    }

    // Copy to clipboard
    const { username } = session?.user
    // TODO: research
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/user/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Copied to clipboard',
            description: 'Profile URL copied to clipboard',
            status: 'success'
        })
    }

    return (
        <div>Dashboard</div>
    )
}