import ConfirmDeleteUserCtx from "@/Contexts/ConfirmDeleteUserCtx";
import { ReactNode, useState } from "react";


export default function ConfirmDeleteUserProvider({ children }: { children: ReactNode }) {
    const [action, setAction] = useState("")

    return <ConfirmDeleteUserCtx.Provider value={{ action, setAction }}>
        {children}
    </ConfirmDeleteUserCtx.Provider>
}
