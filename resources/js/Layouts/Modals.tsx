import ConfirmDeleteModal from "@/Components/modals/ConfirmDeleteModal";
import ConfirmDeleteUserModal from "@/Components/modals/ConfirmDeleteUserModal";
import ProfileDeleteModal from "@/Components/modals/ProfileDeleteModal";
import ReportModal from "@/Components/modals/ReportModal";
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import ConfirmDeleteUserCtx from "@/Contexts/ConfirmDeleteUserCtx";
import ProfileDeleteCtx from "@/Contexts/ProfileDeleteCtx";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import { useContext } from "react";

export default function Modals() {
    const { reportAction, setReportAction } = useContext(ReportActionCtx)
    const { isShown: isProfileDeleteShown, setShow: setProfileDeleteShown } = useContext(ProfileDeleteCtx)
    const { action: isConfirmDeleteShown, setAction: setConfirmDeleteAction } = useContext(ConfirmDeleteCtx)
    const { action: confirmDeleteUserAction, setAction: setConfirmDeleteUserAction } = useContext(ConfirmDeleteUserCtx)

    return <>
        <ReportModal reportAction={reportAction} onClose={() => setReportAction(null)} />
        <ProfileDeleteModal show={isProfileDeleteShown} onClose={() => setProfileDeleteShown(!isProfileDeleteShown)} />
        <ConfirmDeleteModal action={isConfirmDeleteShown} onClose={() => setConfirmDeleteAction("")} />
        <ConfirmDeleteUserModal action={confirmDeleteUserAction} onClose={() => setConfirmDeleteUserAction("")} />
    </>
}
