"use client";

import { register } from "@/actions/register";
import CardWrapper from "@/components/auth/Card-Wrapper";
import FormError from "@/components/Form-Error";
import FormSuccess from "@/components/Form-Success";
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
import { LOGIN_URL } from "@/routes";
import { RegisterData, RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [view, setView] = useState(false);

  const [processing, setTransition] = useTransition();

  const onSubmit = (values: RegisterData) => {
    setError("");
    setSuccess("");
    setView(false);

    setTransition(() => {
      register(values)
        .then(({ success, error }) => {
          if (success) setSuccess(success);
          if (error) setError(error);
        })
        .catch((err) => console.log("REGISTER-FORM ERROR", err));
    });
  };

  return (
    <CardWrapper
      label="Join Us 😎"
      backButtonLabel="Already have an account? Back to login."
      backButtonHref={LOGIN_URL}
      showSocials
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Wick"
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johnwick@email.com"
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
          </div>
          {success && <FormSuccess message={success} />}
          {error && <FormError message={error} />}
          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            disabled={processing}
          >
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
