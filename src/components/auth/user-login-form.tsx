"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotionButton } from "@/components/ui/motion-button";

export const UserAuthLoginForm = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();

  async function submitWithGoogle() {
    setIsGoogleLoading(true);
    const { signIn } = await import("next-auth/react");

    await signIn("google", {
      callbackUrl: searchParams?.get("from") ?? "/auth/login",
    });
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required disabled />
          </div>
          <MotionButton disabled type="submit" className="w-full">
            Login
          </MotionButton>
          <MotionButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={submitWithGoogle}
            loadingText="Redirecting"
            isLoading={isGoogleLoading}>
            Login with Google
          </MotionButton>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
