import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "../lib/supabaseClient"; // Import the Supabase client
import { useState } from "react"; // Import useState to manage error message state

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    role: z.enum(["Dean", "Class Representative", "Head of Department (HoD)", "Arbitrage Member", "Guild Council Member"], {
        required_error: "Please select a role.",
    }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }), // Add password field
});

const StudentLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null); // State for displaying error message

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: "Dean",
        },
        // No default value for password for security
    });

    // Function to clear error when input changes
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { email, password, role } = values;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) { // Supabase returned an error
            console.error("Login failed:", error); // Log the full error object for debugging
            setError(error.message || "An unexpected error occurred."); // Display Supabase error message or a generic one
        } else if (data && data.user) { // Successful login
            // User successfully logged in
            console.log("User logged in:", data.user);
            // Redirect the user to the desired page after successful login
            setError(null); // Clear any previous errors on success
            // Note: Storing sensitive info like role in sessionStorage might not be the best practice.
            // Consider fetching user roles from your database after successful auth if roles are not part of the auth payload.
            // Store relevant user info from Supabase data if needed
            sessionStorage.setItem('studentRole', role); // Still use the selected role from the form
            navigate("/face-scan"); // Navigate to face scan upon successful login
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
            <Link to="/admin-login" className="absolute top-6 right-6 text-sm font-medium text-primary hover:underline">
                Admin Portal
            </Link>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to proceed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {/* Add onChange handler to clear error on input */}
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                            onChange={() => setError(null)} // Clear error on form changes
                        >
                             {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="example@university.edu"
                                                    {...field}
                                                    className="pl-10"
                                                    type="email"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Add Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your password"
                                                {...field}
                                                type="password" // Use type="password" for security
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Login as</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <RadioGroupItem value="Dean" id="dean" />
                                                    <FormLabel htmlFor="dean">Dean</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <RadioGroupItem value="Class Representative" id="class-rep" />
                                                    <FormLabel htmlFor="class-rep">Class Representative</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <RadioGroupItem value="Head of Department (HoD)" id="hod" />
                                                    <FormLabel htmlFor="hod">Head of Department (HoD)</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <RadioGroupItem value="Arbitrage Member" id="arbitrage" />
                                                    <FormLabel htmlFor="arbitrage">Arbitrage Member</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <RadioGroupItem value="Guild Council Member" id="guild" />
                                                    <FormLabel htmlFor="guild">Guild Council Member</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Continue
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/student-register" className="font-medium text-primary hover:underline">
                            Register here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentLogin;
