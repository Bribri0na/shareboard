"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUp } from "@/actions/sign-up";
import { signUpSchema, type SignUpInput } from "@/lib/schemas";

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpInput) => {
    const result = await signUp(values);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Account created!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sign up</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Username
          <input
            type="text"
            {...register("username")}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.username && (
            <span className="text-sm text-red-600">{errors.username.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            {...register("email")}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            {...register("password")}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.password && (
            <span className="text-sm text-red-600">{errors.password.message}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </div>
  );
}