import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom' // 🟢 Waxaan ka dhignay 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api/apiClient'
import { extractErrorMessages } from '../../util/errorUtils'
import useAuthStore from '../../lib/store/authStore'

const LoginForm = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore()

    // State for form values
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value
        })
    }

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/login', credentials)
            return response.data
        },
        onSuccess: (data) => {
            if (data.token) {
               
                const tempUser = { email: formValues.email }; 
                const token = data.token;
                
                setAuth(tempUser, token);
                navigate('/dashboard');
            }
        },
        onError: (err) => {
            console.log("err", err)
            setError(extractErrorMessages(err))
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!formValues.email || !formValues.password) {
            setError('All fields are required')
            return
        }

        loginMutation.mutate({
            email: formValues.email,
            password: formValues.password
        })
    }

    const isLoading = loginMutation.isPending; 
    return (
        <Card className="w-full border-border">
            <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Signin</CardTitle>
                <CardDescription className={"text-center"}>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            
           
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-0">
                    {error && (
                        <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md text-left'>
                            {error}
                        </div>
                    )}

                    <div className='space-y-2'>
                        <div className='text-sm font-medium text-left'>
                            Email
                        </div>
                        <Input 
                            name="email" 
                            type="email"
                            placeholder="email@email.com" 
                            required
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className='space-y-2'>
                        <div className='text-sm font-medium text-left'>
                            Password
                        </div>
                        <Input 
                            name="password" 
                            type="password" 
                            placeholder="*****" 
                            required
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='py-4'>
                        <Button type="submit" className={"w-full cursor-pointer"} disabled={isLoading}>
                            {isLoading ? (
                                <span className='flex items-center gap-2 justify-center'>
                                    <LoaderCircle className="animate-spin" /> login account...
                                </span>
                            ) : (
                                "Login Account"
                            )}
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className={"flex justify-center pt-0"}>
                    <div className='text-center text-sm'>
                        Don't have an account ?{' '}
                        <a onClick={() => navigate('/register')} className='text-primary hover:underline cursor-pointer font-medium'>
                            Sign up
                        </a>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

export default LoginForm;
