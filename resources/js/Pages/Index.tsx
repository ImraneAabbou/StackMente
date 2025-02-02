import { Link } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function Index() {
    const { t } = useLaravelReactI18n()

    return (
        <div>
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="container flex items-center justify-between py-6">
                    <div className="flex lg:flex-1">
                        <Link href="/">
                            <span className="sr-only">StackMente</span>
                            <img
                                alt=""
                                src="/favicon.svg"
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route("login")}
                            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {t("content.login")}
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-md px-3.5 py-2.5 bg-gray/25 hover:bg-gray/50 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {t("content.register")}
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1
                            className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl hyphens-manual"
                            dangerouslySetInnerHTML={
                                {
                                    __html: t("content.headline") as string
                                }
                            }
                        />
                        <p className="mt-8 text-lg text-gray font-light text-pretty sm:text-xl/8">
                            {
                                t("content.subheadline")
                            }
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href={route("feed")}
                                className="rounded-md px-3.5 py-2.5 bg-gray/25 hover:bg-gray/50 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {
                                    t("content.to_feed")
                                }
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
