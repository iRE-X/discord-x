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
import { ChannelType } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const schema = z.object({
    name: z
        .string()
        .min(1, { message: "Server name is required!" })
        .refine(name => name !== "general", {
            message: "Channel name can't be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
});

type FormData = z.infer<typeof schema>;

const CreateChannelModal = () => {
    const {
        isOpen,
        type,
        onClose,
        data: { channelType },
    } = useModal();
    const router = useRouter();
    const params = useParams();

    const openDialog = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", type: channelType || ChannelType.TEXT },
    });
    const isLoading = form.formState.isSubmitting;

    const doSubmit = async (data: FormData) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params.serverId,
                },
            });

            await axios.post(url, data);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log("CREATE CHANNEL ERROR : ", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        } else form.setValue("type", ChannelType.TEXT);
    }, [channelType, form]);

    return (
        <Dialog open={openDialog} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Create A Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Channels can be TEXT, AUDIO or VIDEO Type
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(doSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/60 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="Enter Channel Name"
                                                {...field}
                                            ></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/60 text-black border-0 focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 outline-none capitalize">
                                                    <SelectValue placeholder="Select Channel Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(
                                                    type => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-200 px-6 py-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="primary"
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;
