import SoundCtx from "@/Contexts/SoundCtx";
import { ReactNode } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function SoundProvider({ children }: { children: ReactNode }) {
    const [isEnabled, setEnabled] = useLocalStorageState("soundEnabled", { defaultValue: true })

    return <SoundCtx.Provider value={{ isEnabled, setEnabled }}>
        {children}
    </SoundCtx.Provider>
}
