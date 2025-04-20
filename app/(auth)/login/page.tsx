'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { loginSchema, LoginFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { EyeIcon, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success('Logged in successfully');
      router.push('/');
      router.refresh();
      
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-sm z-10"></div>
        <Image 
          src="https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-20 left-12 z-20 text-white">
          <h2 className="text-5xl font-bold mb-2 drop-shadow-md">Capturing Moments,</h2>
          <h2 className="text-5xl font-bold drop-shadow-md">Creating Memories</h2>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <Link href="/">
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white/10 backdrop-blur-md text-white border-transparent hover:bg-white/20 transition-all duration-200 flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to website
            </Button>
          </Link>
        </div>
      </div>

      {/* Right column - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white mb-3">Log in</h1>
          <p className="text-gray-400 mb-8">
            Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create an account</Link>
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                    errors.email ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                    errors.password ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 text-base"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3.5 border border-gray-700 rounded-xl shadow-sm text-base font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
              >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                    fill="#FFF"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
