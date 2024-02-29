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
import useModal from "@/hooks/useModalStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import UploadFile from "../UploadFile";
import { useEffect } from "react";

const schema = z.object({
    name: z.string().min(1, { message: "Server name is required!" }),
    imageUrl: z.string().min(1, { message: "Server image is required!" }),
});

type FormData = z.infer<typeof schema>;

const EditServerModal = () => {
    const {
        isOpen,
        type,
        onClose,
        data: { server },
    } = useModal();

    const router = useRouter();

    const openDialog = isOpen && type === "editServer";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", imageUrl: "" },
    });

    const isLoading = form.formState.isSubmitting;

    const doSubmit = async (data: FormData) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, data);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log("EDIT SERVER ERROR : ", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form]);

    return (
        <Dialog open={openDialog} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Customize Your Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and image,
                        you can always change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(doSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <div className="flex text-center justify-center items-center space-x-4">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <UploadFile
                                                    endPoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/60 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="Enter Server Name"
                                                {...field}
                                            ></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                        <DialogFooter className="bg-gray-200 px-6 py-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="primary"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServerModal;
