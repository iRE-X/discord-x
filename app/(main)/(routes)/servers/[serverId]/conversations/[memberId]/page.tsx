import React from "react";

interface Props {
    params: {
        memberId: string;
    };
}

const MemberPage = ({ params: { memberId } }: Props) => {
    return <div>MemberPage for {memberId}</div>;
};

export default MemberPage;
