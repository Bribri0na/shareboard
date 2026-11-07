"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { logIn } from "@/actions/log-in";
import { logInSchema, type LogInInput } from "@/lib/schemas";

export default function LogInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogInInput>({
    resolver: zodResolver(logInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LogInInput) => {
    const result = await logIn(values);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Logged in!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}