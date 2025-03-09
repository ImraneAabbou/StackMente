import ThemeCtx from "@/Contexts/ThemeCtx";
import { ReactNode, useLayoutEffect } from "react";
import useLocalStorageState from "use-local-storage-state";


export default function ReportActionProvider({ children }: { children: ReactNode }) {
    const [isDark, setDark] = useLocalStorageState("darkTheme", { defaultValue: false })

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", isDark)
    }, [isDark])

    return <ThemeCtx.Provider value={{ isDark, setDark }}>
        {children}
    </ThemeCtx.Provider>
}
