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
import { EyeIcon } from 'lucide-react';

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

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('apple', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Failed to login with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-indigo-800/70 z-10"></div>
        <Image 
          src="https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Login background"
          fill
          className="object-cover"
        />
        <div className="absolute top-5 left-5 z-20">
          <div className="text-white text-2xl font-bold">AMU</div>
        </div>
        <div className="absolute bottom-20 left-12 z-20 text-white">
          <h2 className="text-4xl font-bold mb-2">Capturing Moments,</h2>
          <h2 className="text-4xl font-bold">Creating Memories</h2>
        </div>
        <div className="absolute top-5 right-5 z-20">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Back to website
            </Button>
          </Link>
        </div>
      </div>

      {/* Right column - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-white mb-2">Log in</h1>
          <p className="text-gray-400 mb-8">
            Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Create an account</Link>
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.email ? 'border-red-400' : 'border-gray-700'
                } bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Email address"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                    errors.password ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Password"
                  disabled={isLoading}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
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
              <div className="ml-auto">
                <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                    fill="#FFF"
                  />
                </svg>
                Google
              </button>
              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.9297 3.25C13.7197 2.25 14.3097 1 14.3097 1C14.3097 1 14.2797 1.74 13.4797 2.72C12.6797 3.7 12.0097 3.99 12.0097 3.99C12.0097 3.99 11.8797 3.5 12.9297 3.25ZM10.0497 4.24C10.4797 4.24 11.6997 3.99 12.6397 3C13.5797 2.01 13.1797 0 13.1797 0C13.1797 0 11.1997 0.24 10.2097 1.5C9.21973 2.76 9.61973 4.01 9.61973 4.01C9.61973 4.01 9.78973 4.24 10.0497 4.24ZM18.1997 14.86C18.1997 14.86 18.0497 14.16 17.5497 13.5C17.0497 12.84 16.2797 12.7 16.2797 12.7C16.2797 12.7 15.4197 12.56 14.5397 13.25C13.6597 13.94 13.7197 14.76 13.7197 14.76C13.7197 14.76 13.5697 16.73 15.0597 17.5C16.5497 18.27 17.8697 17.33 17.8697 17.33C17.8697 17.33 18.3397 16.8 18.1997 14.86ZM14.0497 16.26C13.2497 16.09 12.6697 15.18 12.8297 14.31C12.9897 13.44 13.8597 12.89 14.6597 13.06C15.4597 13.23 16.0397 14.14 15.8797 15.01C15.7197 15.88 14.8497 16.43 14.0497 16.26ZM16.1197 5.25C14.7197 5.25 13.5897 6.38 13.5897 7.78V15C13.5897 16.4 14.7197 17.53 16.1197 17.53C17.5197 17.53 18.6497 16.4 18.6497 15V7.78C18.6497 6.38 17.5197 5.25 16.1197 5.25ZM9.21973 5.25C6.96973 5.25 5.34973 6.88 5.34973 9.13V13.65C5.34973 14.94 4.35973 15.93 3.06973 15.93C1.77973 15.93 0.789733 14.94 0.789733 13.65C0.789733 12.36 1.77973 11.37 3.06973 11.37H3.86973V9.13H3.06973C0.499733 9.13 -1.52588e-05 11.07 -1.52588e-05 13.65C-1.52588e-05 16.23 2.06973 18.17 4.64973 18.17C7.22973 18.17 9.29973 16.23 9.29973 13.65V9.13C9.29973 8.5 9.71973 7.78 10.5797 7.78C11.4397 7.78 11.8597 8.5 11.8597 9.13V10.16H13.5897V9.13C13.5897 6.88 11.4697 5.25 9.21973 5.25Z" fill="currentColor"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
