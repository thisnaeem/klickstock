'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { signupSchema, otpVerificationSchema, SignupFormValues, OtpVerificationValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { EyeIcon, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    setValue: setOtpValue,
  } = useForm<OtpVerificationValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
      email: '',
    },
  });

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      setRegisteredEmail(data.email);
      setRegisteredPassword(data.password);
      setOtpValue('email', data.email);
      setShowOtpForm(true);
      toast.success('Please check your email for the verification code');
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpVerificationValues) => {
    try {
      setIsLoading(true);
      console.log('Submitting OTP:', { email: registeredEmail, otp: data.otp });
      
      data.email = registeredEmail;
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          otp: data.otp,
        }),
      });

      const result = await response.json();
      console.log('Verification response:', { status: response.status, result });

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify email');
      }

      toast.success('Email verified successfully');
      
      // Sign in the user
      const signInResult = await signIn('credentials', {
        email: registeredEmail,
        password: registeredPassword,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push('/');
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message);
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
          alt="Register background"
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

      {/* Right column - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white mb-3">
            {showOtpForm ? 'Verify your email' : 'Create an account'}
          </h1>
          <p className="text-gray-400 mb-8">
            Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Log in</Link>
          </p>
          
          <form className={`space-y-6 ${showOtpForm ? 'hidden' : ''}`} onSubmit={handleSignupSubmit(onSignupSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                    signupErrors.name ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="First name"
                  disabled={isLoading}
                  {...registerSignup('name')}
                />
                {signupErrors.name && (
                  <p className="mt-1.5 text-sm text-red-400">{signupErrors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3.5 border border-gray-700 bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                  signupErrors.email ? 'border-red-400' : 'border-gray-700'
                } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                placeholder="Enter your email address"
                disabled={isLoading}
                {...registerSignup('email')}
              />
              {signupErrors.email && (
                <p className="mt-1.5 text-sm text-red-400">{signupErrors.email.message}</p>
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
                  autoComplete="new-password"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                    signupErrors.password ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Create a password"
                  disabled={isLoading}
                  {...registerSignup('password')}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {signupErrors.password && (
                <p className="mt-1.5 text-sm text-red-400">{signupErrors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 border ${
                    signupErrors.confirmPassword ? 'border-red-400' : 'border-gray-700'
                  } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Confirm password"
                  disabled={isLoading}
                  {...registerSignup('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {signupErrors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-400">{signupErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-600 rounded bg-gray-800"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms & Conditions</Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 text-base disabled:opacity-50 disabled:hover:bg-indigo-600"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        
          <form className={`space-y-6 ${!showOtpForm ? 'hidden' : ''}`} onSubmit={handleOtpSubmit(onOtpSubmit)}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                Enter verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={`appearance-none rounded-xl relative block w-full px-4 py-4 border ${
                  otpErrors.otp ? 'border-red-400' : 'border-gray-700'
                } bg-gray-800/70 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-lg text-center tracking-widest`}
                placeholder="000000"
                disabled={isLoading}
                {...registerOtp('otp', {
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' },
                  pattern: { value: /^[0-9]+$/, message: 'OTP must contain only numbers' }
                })}
              />
              {otpErrors.otp && (
                <p className="mt-1.5 text-sm text-red-400">{otpErrors.otp.message}</p>
              )}
              <p className="mt-3 text-sm text-gray-400">
                We've sent a verification code to <span className="text-white font-medium">{registeredEmail}</span>
              </p>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 text-base"
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
              </Button>
            </div>
          </form>

          {!showOtpForm && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-400">Or register with</span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 