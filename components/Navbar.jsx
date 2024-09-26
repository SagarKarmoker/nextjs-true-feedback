"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    const { data: session } = useSession()
    const user = session?.user

    return (

        <nav className='sticky top-0 py-4 border-b-2'>
            <div className='container mx-auto flex justify-between'>
                <div>
                    <a href="#" className='text-2xl font-bold'>True Feedback</a>
                </div>
                <div>
                    {session ? <> <span>
                        Welcome, {user?.email || user?.name}
                    </span>
                        <Button onClick={() => signOut()}>Sign out</Button>
                    </> : <>
                        <div className='space-x-4'>
                            <Button><Link href="/sign-in">Sign in</Link></Button>
                            <Button><Link href="/sign-up">Sign up</Link></Button>
                        </div>
                    </>}
                </div>
            </div>
        </nav>
    )
}
