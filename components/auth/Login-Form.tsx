"use client";

import { login } from "@/actions/login";
import BackButton from "@/components/auth/Back-Button";
import CardWrapper from "@/components/auth/Card-Wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FORGOT_PASSWORD_URL, REGISTER_URL } from "@/routes";
import { LoginData, LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormError from "@/components/Form-Error";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormSuccess from "@/components/Form-Success";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState(false);

  const [processing, setTransition] = useTransition();

  const onSubmit = (values: LoginData) => {
    setError("");
    setSuccess("");
    setView(false);

    setTransition(() => {
      login(values)
        .then(({ error, success }) => {
          if (error) setError(error);
          if (success) setSuccess(success);
        })
        .catch((err) => console.log("LOGIN-FORM ERROR", err));
    });
  };

  return (
    <CardWrapper
      label="Welcome Back 🤠"
      backButtonLabel="Don't have an account? Register Here."
      backButtonHref={REGISTER_URL}
      showSocials
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      disabled={processing}
                      className="bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 border-none p-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center gap-x-2">
                      <Input
                        placeholder="********"
                        type={view ? "text" : "password"}
                        disabled={processing}
                        className="bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 border-none p-2"
                        {...field}
                      />
                      <button
                        type={"button"}
                        onClick={() => setView(!view)}
                        disabled={processing}
                      >
                        {view ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BackButton label="Forgot password?" href={FORGOT_PASSWORD_URL} />
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            disabled={processing}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
