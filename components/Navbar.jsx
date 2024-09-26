"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@react-email/components'

export default function Navbar() {

    const { data: session } = useSession()
    const user = session?.user



    return (

        <nav>
            <div>
                <a href="#">Message</a>
                {session ? <> <span>
                    Welcome, {user?.email || user?.name}
                </span>
                    <Button onClick={() => signOut()}>Sign out</Button>
                </> : <>
                    <Link href="/sign-in">Sign in</Link>
                    <Link href="/sign-up">Sign up</Link>
                </>}
            </div>
        </nav>
    )
}
