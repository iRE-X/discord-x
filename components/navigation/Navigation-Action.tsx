import { Plus } from "lucide-react";
import React from "react";
import ActionToolTip from "@/components/Action-Tooltip";

const NavigationAction = () => {
    return (
        <div>
            <ActionToolTip label="Add a Server" side="right" align="center">
                <button className="group flex items-center">
                    <div className="bg-white flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] bg-background transition-all overflow-hidden items-center justify-center dark:bg-neutral-600 group-hover:bg-emerald-500">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionToolTip>
        </div>
    );
};

export default NavigationAction;
