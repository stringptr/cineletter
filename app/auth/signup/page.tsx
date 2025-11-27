import { SignupForm } from "@/components/signup-form.tsx";

export default function SignupPage() {
  return (
    <div className="text-white flex h-[90vh] items-center justify-center gap-6">
      <div className="flex w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
