import { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function ErrorPageLayout({ children }: { children: ReactNode }) {
    const {t} = useLaravelReactI18n()

    return <div>
        <nav aria-label="Global" className="container flex items-center justify-between py-6 sticky top-0">
            <div className="flex lg:flex-1">
                <Link href={route("feed")}>
                    <span className="sr-only">StackMente</span>
                    <img
                        alt=""
                        src="/favicon.svg"
                        className="h-8 w-auto"
                    />
                </Link>
            </div>
            <div className="flex gap-2 font-bold text-lg">
                {t("content.ops")}
            </div>
        </nav>
        {children}
    </div>
}
