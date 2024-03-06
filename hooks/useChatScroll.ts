import { useEffect, useState } from "react";

interface Props {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    loadMore: () => void;
    shouldLoadMore: boolean;
    count: number;
    isRefetching: boolean;
}

const useChatScroll = ({
    chatRef,
    bottomRef,
    loadMore,
    shouldLoadMore,
    count,
    isRefetching,
}: Props) => {
    const [hasInitialized, setInitialized] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) loadMore();
        };

        topDiv?.addEventListener("scroll", handleScroll);

        return () => topDiv?.removeEventListener("scroll", handleScroll);
    }, [loadMore, shouldLoadMore, chatRef]);

    useEffect(() => {
        const topDiv = chatRef.current;
        const bottomDiv = bottomRef.current;

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setInitialized(true);
                return true;
            }

            if (!topDiv) return false;

            const distanceFromBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceFromBottom <= 500;
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [bottomRef, chatRef, count, isRefetching, hasInitialized]);
};

export default useChatScroll;
