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

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    role: z.enum(["Dean", "Class Representative", "Head of Department (HoD)", "Arbitrage Member", "Guild Council Member"], {
        required_error: "Please select a role.",
    }),
});

const StudentLogin = () => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: "Dean",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        sessionStorage.setItem('studentEmail', values.email);
        sessionStorage.setItem('studentRole', values.role);
        // This is a placeholder. In a real app, you'd fetch the user's name from a database.
        const userName = values.email.split('@')[0].replace('.', ' ').replace(/\d+/g, '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        sessionStorage.setItem('studentName', userName);
        navigate("/face-scan");
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
