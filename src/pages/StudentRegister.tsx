import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const roleOptions = [
    "Dean",
    "Class Representative",
    "Head of Department (HoD)",
    "Arbitrage Member",
    "Guild Council Member",
];

const formSchema = z.object({
    studentId: z.string().optional(),
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    school: z.string({
        required_error: "Please select a school.",
    }),
    department: z.string().optional(),
    role: z.enum(roleOptions as [string, ...string[]], {
        required_error: "Please select your role/status.",
    }),
}).superRefine((data, ctx) => {
    if (["Class Representative", "Arbitrage Member", "Guild Council Member"].includes(data.role)) {
        if (!data.studentId || !/^[0-9]{9}$/.test(data.studentId)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["studentId"],
                message: "Student ID must be a 9-digit number (required for students)",
            });
        }
    }
    if (data.role !== "Dean") {
        if (!data.department || data.department === "null") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["department"],
                message: "Department is required for this role.",
            });
        }
    }
});

type FormData = z.infer<typeof formSchema>;

const schools = [
    "School of Engineering",
    "School of Arts & Sciences",
    "School of Business",
    "School of Medicine",
];

const departments: Record<string, string[]> = {
    "School of Engineering": ["Computer Science", "Mechanical Engineering", "Electrical Engineering"],
    "School of Arts & Sciences": ["Physics", "Chemistry", "Mathematics"],
    "School of Business": ["Marketing", "Finance", "Management"],
    "School of Medicine": ["General Medicine", "Pediatrics", "Surgery"],
};

const StudentRegister = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData | null>(null);
    const navigate = useNavigate();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            fullName: "",
            email: "",
            role: "Dean",
        },
    });

    const selectedSchool = form.watch("school");
    const selectedRole = form.watch("role");

    function onStep1Submit(values: FormData) {
        setFormData(values);
        setStep(2);
    }

    function handleFinalSubmit() {
        console.log("Final submission data:", formData);
        alert("Registration submitted successfully! (This is a placeholder)");
        navigate("/student-login");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Student Registration {step === 1 ? "(Step 1 of 2)" : "(Step 2 of 2)"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 ? "Please fill in your details." : "Please verify your face to complete registration."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onStep1Submit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                    {roleOptions.map(option => (
                                                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                            <RadioGroupItem value={option} id={option} />
                                                            <FormLabel htmlFor={option}>{option}</FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="studentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student ID <span className="text-xs text-muted-foreground">(required for Students *)</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 123456789" {...field} maxLength={9} inputMode="numeric" disabled={selectedRole === "Dean" || selectedRole === "Head of Department (HoD)"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="As registered in college" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="your.email@university.edu" {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>School</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your school" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {schools.map((school) => (
                                                        <SelectItem key={school} value={school}>
                                                            {school}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department <span className="text-xs text-muted-foreground">(N/A for Deans*)</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={selectedRole === "Dean" || !selectedSchool}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={selectedRole === "Dean" ? "Not required for Dean" : "Select your department"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {selectedSchool && departments[selectedSchool] ? (
                                                        departments[selectedSchool].map((dept) => (
                                                            <SelectItem key={dept} value={dept}>
                                                                {dept}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="null" disabled>Select a school first</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Continue to Face Scan</Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
                                <Camera className="h-24 w-24 text-gray-500" />
                            </div>
                            <div className="space-y-4 w-full">
                                <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Details
                                </Button>
                                <Button onClick={handleFinalSubmit} className="w-full">
                                    Scan Face & Submit
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/student-login" className="font-medium text-primary hover:underline">
                            Login here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentRegister;
