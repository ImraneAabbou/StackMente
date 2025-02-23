import ProfileDeleteCtx from "@/Contexts/ProfileDeleteCtx";
import { ReactNode, useState } from "react";


export default function ProfileDeleteProvider({ children }: { children: ReactNode }) {
    const [isShown, setShow] = useState(false)

    return <ProfileDeleteCtx.Provider value={{ isShown, setShow }}>
        {children}
    </ProfileDeleteCtx.Provider>
}
