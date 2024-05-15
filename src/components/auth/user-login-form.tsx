"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MotionButton } from "@/components/ui/motion-button";
import { userAuthLoginSchema } from "@/lib/validations/auth";

type UserLoginFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof userAuthLoginSchema>;

export const UserAuthLoginForm = ({
  className,
  ...props
}: UserLoginFormProps) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();

  async function submitWithGoogle() {
    setIsGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: searchParams?.get("from") ?? "/auth/login",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "OAuthSignInError") {
          return toast.error("Something went wrong.", {
            description: "Your sign in request failed. Please try again.",
            action: {
              label: "Retry",
              onClick: () => void submitWithGoogle(),
            },
          });
        }
        return toast.error("Something went wrong.", {
          description: "Your sign in request failed. Please try again.",
          action: {
            label: "Retry",
            onClick: () => void submitWithGoogle(),
          },
        });
      }
      setIsGoogleLoading(false);
    }
  }

  const loginForm = useForm<FormData>({
    resolver: zodResolver(userAuthLoginSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
  } = loginForm;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function authenticateUser(formdata: FormData) {
    setIsLoading(true);
    try {
      await signIn("credentials", formdata);

      toast.success("Welcome back!", {
        description: "You have been successfully signed in.",
      });

      setIsLoading(false);
      // Redirect to the page the user came from
      return router.push("/home");
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin") {
          return toast.error("Invalid email or password.", {
            description: "Please check your credentials and try again.",
          });
        }
        return toast.error("Something went wrong.", {
          description: "Your sign in request failed. Please try again.",
          action: {
            label: "Retry",
            onClick: () => void authenticateUser(formdata),
          },
        });
      }

      setIsLoading(false);
    }
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
          <Form {...loginForm}>
            <form onSubmit={handleSubmit(authenticateUser)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-2 flex flex-col gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl id="email">
                          <Input
                            type="email"
                            id="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mt-2 flex flex-col gap-2">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl id="password">
                          <Input
                            type="password"
                            id="password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{errors.password?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <MotionButton
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  loadingText="Authenticating">
                  Login
                </MotionButton>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-between gap-2">
            <div
              className={buttonVariants({
                variant: "outline",
                size: "icon",
                className: "aspect-square",
              })}>
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt="google-icon"
                width={16}
                height={16}
              />
            </div>
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
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
