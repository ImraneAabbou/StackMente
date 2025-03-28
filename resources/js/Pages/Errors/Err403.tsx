import ErrorPageLayout from "@/Layouts/ErrorPageLayout";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function Err403() {
    const { t } = useLaravelReactI18n()

    return (
        <ErrorPageLayout>
            <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-4">
                <img src="/images/errors/403.svg" className="max-w-sm w-full" />
                <div className="text-center">
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
                        {t("error_pages.403_title")}
                    </h1>
                    <p className="mt-6 text-lg font-medium text-pretty text-secondary lg:text-xl/8">
                        {t("error_pages.403_desc")}
                    </p>
                </div>
            </main>
        </ErrorPageLayout>
    )
}
