"use client";
import { cn } from "cn";
import axios from "axios";

import { usePostLoginQuery } from "@/api/auth/auth-query";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { loginValidator } from "@/validators/loginValidator";
import { Spinner } from "../ui/spinner";
import { useAuthStore } from "@/store/useAuthStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isPending } = usePostLoginQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const authStore = useAuthStore();

  function validationErrors() {
    let isError = false;
    const validator = loginValidator.safeParse({ email, password });
    if (!validator.success) {
      isError = true;
      const emailIssue = validator.error.issues.find(
        (issue) => issue.path[0] === "email",
      );
      const passwordIssue = validator.error.issues.find(
        (issue) => issue.path[0] === "password",
      );
      setEmailError(emailIssue?.message ?? "");
      setPasswordError(passwordIssue?.message ?? "");
    }
    return isError;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isError = validationErrors();

    if (isError) {
      return;
    }
    mutate(
      { email, password },
      {
        onSuccess: (res) => {
          authStore.setUser(res.data.user);
          authStore.setAccessToken(res.accessToken);
          // Handle successful login, e.g., redirect to dashboard
        },
        onError: (error) => {
          if (axios.isAxiosError<{ message?: unknown }>(error)) {
            const message = error.response?.data?.message;
            setPasswordError(message as string);
          }
        },
      },
    );
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field className="gap-0">
          <FieldLabel className="mb-1.5" htmlFor="email">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError("")}
          />
          {emailError && (
            <p className="mt-1 text-[12px] text-red-500">{emailError}</p>
          )}
        </Field>
        <Field className="gap-0">
          <div className="flex items-center">
            <FieldLabel className="mb-1.5" htmlFor="password">
              Password
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            onFocus={() => setPasswordError("")}
          />
          {passwordError && (
            <p className="mt-1 text-[12px] text-red-500">{passwordError}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner className="size-5" /> : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
