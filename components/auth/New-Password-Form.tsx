"use client";

import { NewPasswordData, NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import CardWrapper from "@/components/auth/Card-Wrapper";
import { newPassword } from "@/actions/new-password";
import FormError from "@/components/Form-Error";
import FormSuccess from "@/components/Form-Success";
import { LOGIN_URL } from "@/routes";
import { Eye, EyeOff } from "lucide-react";

const NewPasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<NewPasswordData>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "" },
  });

  const searchParams = useSearchParams();
  const token = searchParams!.get("token");

  const [isPending, startTransaction] = useTransition();
  const [view, setView] = useState(false);

  const onSubmit = async (values: NewPasswordData) => {
    setSuccess("");
    setError("");
    setView(false);

    startTransaction(() => {
      newPassword(values, token).then((res) => {
        if (res.success) setSuccess(res.success);
        if (res.error) setError(res.error);
      });
    });
  };

  return (
    <CardWrapper
      label="Create New Password"
      backButtonLabel="Back to login"
      backButtonHref={LOGIN_URL}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center gap-x-2">
                      <Input
                        placeholder="********"
                        type={view ? "text" : "password"}
                        disabled={isPending}
                        className="bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 border-none p-2"
                        {...field}
                      />
                      <button
                        type={"button"}
                        onClick={() => setView(!view)}
                        disabled={isPending}
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
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isPending}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
