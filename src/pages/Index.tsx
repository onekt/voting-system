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
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { type Admin } from "@/components/AdminRequestManagement";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Head admin login
    if (
      values.email === "admincst@gmail.com" &&
      values.password === "Adminportal@123"
    ) {
      sessionStorage.setItem('loggedInUser', JSON.stringify({ email: values.email, role: 'head-admin' }));
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      navigate("/admin");
      return;
    }

    // Other admins login
    try {
      const storedAdmins = localStorage.getItem('admins');
      if (storedAdmins) {
        const admins: Admin[] = JSON.parse(storedAdmins);
        const admin = admins.find(a => a.email === values.email && a.password === values.password);

        if (admin) {
          sessionStorage.setItem('loggedInUser', JSON.stringify({ email: values.email, role: 'admin' }));
          toast({
            title: "Login Successful",
            description: "Redirecting to dashboard...",
          });
          navigate("/admin");
          return;
        }
      }
    } catch (e) {
      console.error("Could not parse admins from localStorage", e);
    }

    if (
      values.email === "to.admincst@gmail.com" &&
      values.password === "Adminportal@123"
    ) {
      toast({
        title: "Redirecting to Registration",
        description: "Please create your admin account.",
      });
      navigate("/register");
      return;
    }

    toast({
      variant: "destructive",
      title: "Login Failed",
      description: "Invalid email or password.",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Welcome to the College Voting System
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
                        <Input placeholder="example@gmail.com" {...field} className="pl-10" />
                      </div>
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
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
