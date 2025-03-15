import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import { ReactNode, useState } from "react";


export default function ConfirmDeleteProvider({ children }: { children: ReactNode }) {
    const [action, setAction] = useState("")

    return <ConfirmDeleteCtx.Provider value={{ action, setAction }}>
        {children}
    </ConfirmDeleteCtx.Provider>
}
