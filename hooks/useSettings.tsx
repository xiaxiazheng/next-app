import { useEffect, useState } from "react";
import { getSettings } from "@xiaxiazheng/blog-libs";

interface ContextType {
    todoNameMap: Record<string, any>;
    todoDescriptionMap: Record<string, any>;
    todoPoolDefaultShow: number;
    todoColorNameMap: Record<string, any>;
    todoColorMap: Record<string, any>;
    todoCategoryDefaultShow: number;
    todoDefaultColor: number;
    quickDecisionConfig: Record<string, any>;
    todoShowBeforeToday: Record<string, any>;
    todoPreset: Record<string, any>;
};

let lastSettings = {};
let isRequesting = false;
const useSettings = () => {
    const [settings, setSettings] = useState<Partial<ContextType>>({});

    const getSettingsData = async () => {
        isRequesting = true;
        const res = await getSettings();
        setSettings(res);
        lastSettings = res;
        isRequesting = false;
    };

    useEffect(() => {
        if (JSON.stringify(settings) === "{}") {
            if (JSON.stringify(lastSettings) !== "{}") {
                setSettings(lastSettings);
            } else {
                !isRequesting && getSettingsData();
            }
        }
    });

    return settings;
};

export default useSettings;
