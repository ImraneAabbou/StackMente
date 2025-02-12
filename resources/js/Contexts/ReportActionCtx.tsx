import { createContext } from "react"

type ReportActionCtxType = {
    reportAction: string | null;
    setReportAction: (action: string | null) => any
}

const ReportActionCtx = createContext<ReportActionCtxType>({
    reportAction: null,
    setReportAction: () => { }
})

export default ReportActionCtx
