import AuthForm from "@/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <div className="max-w-sm mx-auto mt-12 px-4">
      <h1 className="text-xl font-semibold text-center mb-6">Sign In</h1>
      <AuthForm type="signin" />
    </div>
  );
}
