
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // For now, using simple credential check
      if (values.email === 'admin@admin.com' && values.password === 'welloadmin') {
        // Set admin session in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-lilac-dark">
            <span className="text-pink">✿</span> Admin Login
          </h1>
          <p className="mt-2 text-gray-600">Please sign in to access the admin dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input 
                        placeholder="admin@example.com" 
                        className="pl-10" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        className="pl-10" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-lilac hover:bg-lilac-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="text-pink-dark"
          >
            Back to Patient View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
