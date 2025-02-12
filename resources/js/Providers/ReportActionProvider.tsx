import ReportActionCtx from "@/Contexts/ReportActionCtx";
import { ReactNode, useState } from "react";


export default function ReportActionProvider({ children }: { children: ReactNode }) {
    const [reportAction, setReportAction] = useState<null | string>(null)

    return <ReportActionCtx.Provider value={{ reportAction, setReportAction }}>
        {children}
    </ReportActionCtx.Provider>
}
