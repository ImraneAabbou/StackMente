import ReportModal from "@/Components/modals/ReportModal";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import { useContext } from "react";

export default function Modals() {
    const { reportAction, setReportAction } = useContext(ReportActionCtx)

    return <>
        <ReportModal reportAction={reportAction} onClose={() => setReportAction(null)} />
    </>
}
