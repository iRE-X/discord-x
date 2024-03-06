"use client";

import { useUser } from "@clerk/nextjs";
import {
    LiveKitRoom,
    VideoConference,
    AudioConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    chatId: string;
    audio: boolean;
    video: boolean;
}

const MediaRoom = ({ chatId, audio, video }: Props) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName) return;

        const name = `${user?.firstName} ${user?.lastName}`;

        (async () => {
            try {
                const res = await fetch(
                    `/api/livekit?room=${chatId}&username=${name}`
                );

                const data = await res.json();

                setToken(data.token);
            } catch (error) {
                console.log("MEDIA-ROOM ERROR: ", error);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);

    if (token === "")
        return (
            <div className="flex flex-col flex-1 gap-y-2 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        );

    return (
        <LiveKitRoom
            token={token}
            video={video}
            audio={audio}
            connect
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            className="flex-1"
        >
            {video ? <VideoConference /> : audio ? <AudioConference /> : null}
        </LiveKitRoom>
    );
};

export default MediaRoom;
