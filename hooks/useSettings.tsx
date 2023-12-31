import { useEffect, useState } from "react";
import { getSettings } from "../service/settings";

let lastSettings = {};
const useSettings = () => {
    const [settings, setSettings] = useState<any>({});

    const getSettingsData = async () => {
        const res = await getSettings();
        setSettings(res.data);
        lastSettings = res.data;
    };

    useEffect(() => {
        if (JSON.stringify(lastSettings) !== '{}') {
            setSettings(lastSettings);
        } else {
            getSettingsData();
        }
    }, []);

    return settings;
};

export default useSettings;
