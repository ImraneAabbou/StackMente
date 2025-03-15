import { ReactNode } from "react";
import AdminSidebar from "./Components/AdminSidebar"
import Modals from "./Modals";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <div className="">
        <AdminSidebar >
            {children}
        </AdminSidebar>
        <Modals />
    </div>
}
