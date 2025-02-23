import ProfileDeleteModal from "@/Components/modals/ProfileDeleteModal";
import ReportModal from "@/Components/modals/ReportModal";
import ProfileDeleteCtx from "@/Contexts/ProfileDeleteCtx";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import { useContext } from "react";

export default function Modals() {
    const { reportAction, setReportAction } = useContext(ReportActionCtx)
    const { isShown, setShow } = useContext(ProfileDeleteCtx)

    return <>
        <ReportModal reportAction={reportAction} onClose={() => setReportAction(null)} />
        <ProfileDeleteModal show={isShown} onClose={() => setShow(!isShown)} />
    </>
}
