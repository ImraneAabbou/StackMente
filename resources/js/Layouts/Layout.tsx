import { ReactNode } from "react";
import Nav from "./Components/Nav";
import Sidebar from "./Components/Sidebar"

export default function Layout({ children }: { children: ReactNode }) {
    return <div>
        <Nav />
        <div className="h-full flex gap-4 container">
            <Sidebar />
            <div className="grow">
                {children}
            </div>
        </div>
    </div>
}
