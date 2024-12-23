import React, { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Eye, EyeOff} from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"



import {
    Card,
    CardContent,
    // CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function SignIn() {
    const {isLoaded, signIn, setActive} = useSignIn()
    const [emailAddress, setEmailAddress] =useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()

    if (!isLoaded) {
        return null;
    }

    async function submit (e:React.FormEvent) {
        e.preventDefault()

        if (!isLoaded) {
            return null;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password: password
            })

            if(result.status === 'complete') {
                await setActive({
                    session: result.createdSessionId
                })

                router.push("/dashboard")
            } else {
                console.log(JSON.stringify(result, null, 2))
            }
        } catch (err: any) {
            console.error("Error", err.errors[0].message)
            setError(err.errors[0].message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold text-center'>
                        Sign In to Todo Master
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className='space-y-4'>
                        <div className="space-y-2">
                            <Label htmlFor='email'>Email</Label>
                            <Input 
                                type='email'
                                id='email'
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='password'>password</Label>
                            <div className="relative">
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-2 top-1/2 -translate-y-1/2'
                                >
                                    {showPassword ? (
                                            <EyeOff className='h-4 w-4 text-gray-500' />
                                        ) : (
                                            <Eye className='h-4 w-4 text-gray-500' />
                                        )
                                    }
                                </button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type='submit' className='w-full'>
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className='justify-center'>
                    <p className="text-sm text-muted-foreground">
                        Dont&apos;t have an account?{" "}
                        <Link 
                            href="/sign-up"
                            className='font-medium text-primary hover:underline'
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignIn