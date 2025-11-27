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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

import { RegisterPayload } from "@/types/user"
import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { registerUser } from "@/lib/api"

export function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const { isAuthenticated } = useAuth();
  
    useEffect(() => {
        const role = localStorage.getItem("role");
        if(isAuthenticated && (role != "admin")){
            router.replace("/");
        }
    }, [])

    const [form, setForm] = useState({
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMessage("");

        if(!form.password || !form.username || !form.password || !form.confirmPassword ){
            setMessage("All fields are required!")
            return;
        };

        if (form.password !== form.confirmPassword) {
            setMessage("Password do not match");
            return;
        };

        setLoading(true);
        try {
            const payload: RegisterPayload = {
                username: form.username,
                name: form.name,
                password: form.password,
            };
            const res = await registerUser(payload);

            if (res.data?.token) {
                const decodedToken = JSON.parse(atob(res.data.token.split('.')[1]));
                const expiryTime = decodedToken.exp * 1000; 
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("tokenExpiry", expiryTime.toString());
            }

            router.push("/");
            setMessage(res.message || "Registration Successful!");
        } catch (error: any) {
        setMessage(error.message || "Registration failed. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Signup New Account</CardTitle>
                    <CardDescription>
                        Enter your username and make a new Strong Password
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
                                        onChange={e => handleChange("password", e.target.value)}
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
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirmpassword">Confirm Password</Label>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="confirmpassword" 
                                        type={showPassword2 ? "text" : "password"}
                                        placeholder="Re-enter your new password" 
                                        required 
                                        value={form.confirmPassword}
                                        onChange={e => handleChange("confirmPassword", e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword2(!showPassword2)}
                                    >
                                        {showPassword2 ? (
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
                <Button type="submit" className="w-full" onClick={handleRegister}>
                    Register
                </Button>
                <a className="flex items-center gap-2 cursor-pointer" onClick={()=>{router.push("/login")}}>
                    <ArrowLeft size={16} />
                    <span>Back to login page</span>
                </a>
                {message && (
                    <p className="text-center text-sm text-red-400 mt-6">{message}</p>
                )}
            </CardFooter>
            </Card>
        </div>
    )
}
