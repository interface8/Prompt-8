import AuthForm from "@/components/auth/AuthForm";
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            PromptSearch
          </Link>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Discover AI Prompts<br />That Actually Work
          </h1>
          <p className="text-indigo-100 text-lg">
            Join thousands of creators sharing, discovering, and monetizing high-quality AI prompts.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">12.4K+</p>
              <p className="text-indigo-100 text-sm">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">5.2K+</p>
              <p className="text-indigo-100 text-sm">Prompts Shared</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="lg:hidden text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block mb-8">
              PromptSearch
            </Link>
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue to your feed</p>
          </div>
          <AuthForm type="signin" />
        </div>
      </div>
    </div>
  );
}
