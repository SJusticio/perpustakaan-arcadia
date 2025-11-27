"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { loginUser } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { ApiResponse, LoginPayload } from "@/types/user"

export function LoginPage() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if(isAuthenticated){
        router.replace("/");
        }
    }, [])

    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({...prev, [field]:value}))
    }

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMessage("");

        if (!form.username || !form.password) {
            setMessage("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const payload: LoginPayload = {
                username: form.username,
                password: form.password,
            };

            const res: ApiResponse = await loginUser(payload);

            if (res.data?.token) {
                const decodedToken = JSON.parse(atob(res.data.token.split('.')[1]));
                const expiryTime = decodedToken.exp * 1000; 
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.userId)
                localStorage.setItem("role", res.data.role)
                localStorage.setItem("user", res.data.user)
                localStorage.setItem("tokenExpiry", expiryTime.toString());
            }

            setMessage("Login successful!");

            const role = res.data.role;
            if(role === "admin"){
                router.push("/dashboard");
            }

            router.push("/");
        } catch (error: any) {
            setMessage( error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const router = useRouter();
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your username below to login to your account
                    </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="Enter your username"
                                required
                                value={form.username}
                                onChange={e => handleChange("username", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input 
                                    id="password" 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    required
                                    value={form.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" onClick={handleLogin}>
                Login
                </Button>
                <Button variant="outline" className="w-full" onClick={()=>{router.push("/register")}}>
                Sign-up
                </Button>
                {message && (
                    <p className="text-center text-sm text-red-400 mt-6">{message}</p>
                )}
            </CardFooter>
            </Card>
        </div>
    )
}
