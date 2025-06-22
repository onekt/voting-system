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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, School, Building } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { supabase } from "../lib/supabaseClient";
import { type AuthError } from '@supabase/supabase-js';
const privilegeOptions = [
  "Dean",
  "Class Representative",
  "Head of Department (HoD)",
  "Arbitrage Member",
  "Guild Council Member",
  "Invigilator",
];

const formSchema = z.object({
  studentId: z.string().optional(),
  privilege: z.enum(privilegeOptions as [string, ...string[]], { required_error: "Please select a privilege." }),
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  school: z.string().optional(),
  department: z.string().optional(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." }),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (["Class Representative", "Arbitrage Member", "Guild Council Member"].includes(data.privilege)) {
    if (!data.studentId || !/^[0-9]{9}$/.test(data.studentId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["studentId"],
        message: "Student ID must be a 9-digit number (required for Students *)",
      });
    }
  }
  if (data.privilege !== "Dean" && data.privilege !== "Invigilator") {
    if (!data.department || data.department === "null") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Department is required for this privilege.",
      });
    }
  }
  if (data.privilege !== "Invigilator") {
    if (!data.school || data.school === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["school"],
        message: "School is required for this privilege.",
      });
    }
  }
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      privilege: undefined,
      fullName: "",
      email: "",
      phoneNumber: "",
      school: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedPrivilege = form.watch("privilege");
  const handleInputChange = () => {
    if (supabaseError) setSupabaseError(null);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, ...otherFields } = values; // No need for confirmPassword after validation
    setSupabaseError(null); // Clear previous errors on new submission

    supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        data: { // Store other fields in the user's metadata
          full_name: values.fullName, // Assuming a full_name column in user metadata
          phone_number: values.phoneNumber, // Assuming a phone_number column
          school: values.school, // Assuming a school column
          department: values.department, // Assuming a department column
          student_id: values.studentId, // Assuming a student_id column
          privilege: values.privilege, // Store the selected privilege/role
        }
      } as any // Cast to any for now, as metadata typing can be complex
    ).then(( { error } : { error: AuthError | null } ) => {
      if (error) {
        console.error("Supabase registration error:", error);
        setSupabaseError(error.message);
      }
    })
    .catch((error) => {
      console.error("Unexpected registration error:", error);
      setSupabaseError(error.message || "An unexpected error occurred. Please try again.");
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Registration Request</CardTitle>
          <CardDescription className="text-center">
            Fill in your details to request admin access.
          </CardDescription>
        </CardHeader>
        {supabaseError && (
           <p className="text-red-500 text-sm text-center mt-2">{supabaseError}</p>
        )}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="privilege"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>you this privilege as</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        {privilegeOptions.map(option => (
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
                      <Input placeholder="e.g., 123456789" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} maxLength={9} inputMode="numeric" disabled={selectedPrivilege === "Dean" || selectedPrivilege === "Head of Department (HoD)"} />
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
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Doe" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} className="pl-10" />
                      </div>
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="admin@example.com" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. +1 234 567 890" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} className="pl-10" />
                      </div>
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
                    <FormControl>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. School of Engineering" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} className="pl-10" />
                      </div>
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} className="pl-10" disabled={selectedPrivilege === "Dean"} />
                   </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          onChange={(e) => { field.onChange(e); handleInputChange(); }}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          onChange={(e) => { field.onChange(e); handleInputChange(); }}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send Request
              </Button>
              <div className="mt-4 text-center text-sm">
                Back to{" "}
                <Link to="/" className="font-medium text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
