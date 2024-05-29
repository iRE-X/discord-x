"use client";

import React, { useCallback, useEffect, useState } from "react";
import CardWrapper from "./Card-Wrapper";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "@/actions/verifyToken";
import FormError from "@/components/Form-Error";
import FormSuccess from "@/components/Form-Success";
import { LOGIN_URL } from "@/routes";

const NewVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams!.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Token is missing!");
      return;
    }

    verifyToken(token)
      .then((data) => {
        setSuccess(data?.success || "");
        setError(data?.error || "");
      })
      .catch((err) => {
        setError("Something Went Wrong!");
      });
  }, []);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <CardWrapper
      label="Verifying your email"
      backButtonLabel="Back to login"
      backButtonHref={LOGIN_URL}
    >
      <div className="flex justify-center">
        {!success && !error && <FaSpinner className="h-5 w-5 animate-spin" />}
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
