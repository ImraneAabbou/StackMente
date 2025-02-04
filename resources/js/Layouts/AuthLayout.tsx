import { ReactNode } from "react";
import Nav from "./Components/Nav";

export default function AuthLayout({children} : {children: ReactNode}) {
    return <div>
        <Nav />
        {children}
    </div>
}
