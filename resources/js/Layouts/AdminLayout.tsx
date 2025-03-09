import { ReactNode } from "react";
import AdminSidebar from "./Components/AdminSidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <div className="">
        <AdminSidebar >
            {children}
        </AdminSidebar>
    </div>
}
