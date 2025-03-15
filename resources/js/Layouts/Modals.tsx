import ConfirmDeleteModal from "@/Components/modals/ConfirmDeleteModal";
import ProfileDeleteModal from "@/Components/modals/ProfileDeleteModal";
import ReportModal from "@/Components/modals/ReportModal";
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import ProfileDeleteCtx from "@/Contexts/ProfileDeleteCtx";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import { useContext } from "react";

export default function Modals() {
    const { reportAction, setReportAction } = useContext(ReportActionCtx)
    const { isShown: isProfileDeleteShown, setShow: setProfileDeleteShown } = useContext(ProfileDeleteCtx)
    const { action: isConfirmDeleteShown, setAction: setConfirmDeleteAction } = useContext(ConfirmDeleteCtx)

    return <>
        <ReportModal reportAction={reportAction} onClose={() => setReportAction(null)} />
        <ProfileDeleteModal show={isProfileDeleteShown} onClose={() => setProfileDeleteShown(!isProfileDeleteShown)} />
        <ConfirmDeleteModal action={isConfirmDeleteShown} onClose={() => setConfirmDeleteAction("")} />
    </>
}
