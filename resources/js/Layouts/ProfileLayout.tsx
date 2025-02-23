import { ReactNode } from "react";
import Layout from "./Layout";
import ProfileNav from "./Components/ProfileNav";

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return <Layout>
        <div className="flex md:flex-row-reverse flex-col gap-12 mb-12 mt-4">
            <ProfileNav />
            <div className="grow">
                {children}
            </div>
        </div>
    </Layout>
}
