import { useEffect, useState } from "react";
import { getSettings } from "../service/settings";

let lastSettings = {};
let isRequesting = false;
const useSettings = () => {
    const [settings, setSettings] = useState<any>({});

    const getSettingsData = async () => {
        isRequesting = true;
        const res = await getSettings();
        setSettings(res.data);
        lastSettings = res.data;
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
