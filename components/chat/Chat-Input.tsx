"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Plus, SendHorizonal } from "lucide-react";

import axios from "axios";
import qs from "query-string";

import EmojiPicker from "@/components/Emoji-Picker";
import useModal from "@/hooks/useModalStore";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    apiUrl: string;
    name: string;
    type: "channel" | "conversation";
    query: Record<string, any>;
}

const formSchema = z.object({
    content: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const ChatInput = ({ apiUrl, name, type, query }: Props) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: "" },
    });

    const { onOpen } = useModal();
    const router = useRouter();

    const ref = useRef<ElementRef<"input">>(null);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: FormData) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            form.reset();
            await axios.post(url, values);

            router.refresh();
        } catch (error) {
            console.log("CHAT-INPUT ERROR:", error);
        }
    };

    useEffect(() => {
        ref?.current?.focus();
    }, [isLoading]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6 flex gap-x-5">
                                    <button
                                        onClick={() =>
                                            onOpen("messageFile", {
                                                apiUrl,
                                                query,
                                            })
                                        }
                                        type="button"
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition flex justify-center items-center"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        // disabled={isLoading}
                                        className="pl-14 pr-24 py-6 dark:bg-zinc-700/75 bg-zinc-200/90 focus-visible:ring-0 focus-visible:ring-offset-0 border-none border-0 text-zinc-600 dark:text-zinc-200"
                                        placeholder={`Message ${
                                            type === "channel"
                                                ? "#" + name
                                                : name
                                        }`}
                                        {...field}
                                        ref={ref}
                                    />
                                    <div className="absolute top-7 right-20">
                                        <EmojiPicker
                                            onChange={(emoji: string) =>
                                                field.onChange(
                                                    `${field.value}${emoji}`
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        className="absolute top-5 right-5 p-2 border-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-zinc-500 dark:border-zinc-400 hover:border-zinc-600 dark:hover:border-zinc-300"
                                        type="submit"
                                    >
                                        <SendHorizonal />
                                    </button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default ChatInput;
