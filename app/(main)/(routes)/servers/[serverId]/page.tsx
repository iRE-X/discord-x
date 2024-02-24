interface Props {
    params: {
        serverId: string;
    };
}

import React from "react";

const ServerPage = ({ params: { serverId } }: Props) => {
    return <div>ServerPage for server id : {serverId}</div>;
};

export default ServerPage;
