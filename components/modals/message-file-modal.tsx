"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import UploadFile from "@/components/UploadFile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useModal from "@/hooks/useModalStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

const schema = z.object({
  fileUrl: z.string().min(1, { message: "Attach a file to Send" }),
});

type FormData = z.infer<typeof schema>;

const MessageFileModal = () => {
  const router = useRouter();

  const {
    isOpen,
    type,
    onClose,
    data: { query, apiUrl },
  } = useModal();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fileUrl: "" },
  });

  const openDialog = isOpen && type === "messageFile";
  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const doSubmit = async (data: FormData) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, { ...data, content: data.fileUrl });

      handleClose();
      router.refresh();
    } catch (error) {
      console.log("ADD-AN-ATTACHMENT ERROR : ", error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(doSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex text-center justify-center items-center space-x-4">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadFile
                          endPoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
            </div>
            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button type="submit" disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
