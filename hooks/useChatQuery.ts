import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface Data {
    items: [];
    nextCursor: string;
}

interface Props {
    apiUrl: string;
    queryKey: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: Props) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    [paramKey]: paramValue,
                    cursor: pageParam,
                },
            },
            { skipNull: true }
        );

        const res = await fetch(url);
        return res.json();
    };

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
        useInfiniteQuery({
            queryKey: [queryKey],
            queryFn: fetchMessages,
            getNextPageParam: lastpage => lastpage?.nextCursor,
            refetchInterval: isConnected ? false : 1000,
        });

    return { data, fetchNextPage, isFetchingNextPage, hasNextPage, status };
};

export default useChatQuery;
