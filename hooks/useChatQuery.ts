import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface Props {
    apiUrl: string;
    queryKey: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: Props) => {
    // const { isConnected } = useSocket();

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

    return useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: lastpage => lastpage?.nextCursor,
        refetchInterval: 1000,
    });
};

export default useChatQuery;
