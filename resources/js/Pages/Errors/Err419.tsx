import ErrorPageLayout from "@/Layouts/ErrorPageLayout";
import { Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function Err419() {
    const { t } = useLaravelReactI18n()

    return (
        <ErrorPageLayout>
            <main className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center gap-12 px-4">
                <img src="/images/errors/419.svg" className="max-w-sm w-full" />
                <div className="text-center">
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
                        {t("error_pages.419_title")}
                    </h1>
                    <p className="mt-6 text-lg font-medium text-pretty text-secondary lg:text-xl/8">
                        {t("error_pages.419_desc")}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href={route("feed")}
                            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-onPrimary shadow-xs"
                        >
                            {t("error_pages.419_action")}
                        </Link>
                    </div>
                </div>
            </main>
        </ErrorPageLayout>
    )
}
