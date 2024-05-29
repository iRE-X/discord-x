"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CardWrapper from "@/components/auth/Card-Wrapper";
import { Button } from "@/components/ui/button";
import FormError from "@/components/Form-Error";
import FormSuccess from "@/components/Form-Success";

import { reset } from "@/actions/reset";

import { zodResolver } from "@hookform/resolvers/zod";
import { ResetData, ResetSchema } from "@/schemas";
import { LOGIN_URL } from "@/routes";

const ResetForm = () => {
  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [processing, setTransition] = useTransition();

  const onSubmit = (values: ResetData) => {
    setError("");
    setSuccess("");

    setTransition(() => {
      reset(values)
        .then(({ success, error }) => {
          if (success) setSuccess(success);
          if (error) setError(error);
        })
        .catch((err) => console.log("RESET-FORM ERROR", err));
    });
  };

  return (
    <CardWrapper
      label="Forgot your password?"
      backButtonLabel="Back to Login"
      backButtonHref={LOGIN_URL}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
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
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button
              type="submit"
              className="w-full"
              variant="secondary"
              disabled={processing}
            >
              Send Reset Email
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ResetForm;
