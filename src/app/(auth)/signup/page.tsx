import AuthForm from "@/components/auth/AuthForm";
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
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
            Start Your<br />Creator Journey
          </h1>
          <p className="text-indigo-100 text-lg">
            Create an account to share your prompts, earn from your expertise, and connect with a thriving AI community.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">✓</div>
              <span>Share unlimited prompts</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">✓</div>
              <span>Monetize your expertise</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">✓</div>
              <span>Connect with creators</span>
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
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Create Account</h2>
            <p className="text-gray-400">Join the community today</p>
          </div>
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
}
