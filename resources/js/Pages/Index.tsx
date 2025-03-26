import { Link } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function Index() {
    const { t } = useLaravelReactI18n()

    return (
        <div>

            <style>
                {`
                @keyframes subtleMove {
                    0% {
                        transform: translateY(0) rotate(0deg) scale(1);
                        opacity: 0.75;
                    }
                    50% {
                        transform: translateY(-10px) rotate(360deg) scale(1.25);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0) rotate(0deg) scale(1);
                        opacity: 0.75;
                    }
                }
                @keyframes floatUpDown {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes driftLeftRight {
                    0%, 100% {
                        transform: translateX(-25px) translateY(0px);
                    }
                    50% {
                        transform: translateX(0px) translateY(-25px);
                    }
                }
            `}
            </style>

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
                            className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs hover:bg-secondary/10"
                        >
                            {t("content.login")}
                        </Link>
                        <Link
                            href={route("register")}
                            className="bg-primary shadow-sm hover:bg-primary/90 text-onPrimary rounded-md px-3.5 py-2.5 bg-gray/25 hover:bg-gray/50 text-sm font-semibold shadow-xs"
                        >
                            {t("content.register")}
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="relative isolate pt-14">
                <svg
                    className="absolute inset-0 -z-10 h-full w-full stroke-onBackground-dark/10 dark:stroke-onBackground-light/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50/10 dark:fill-gray-800/10">
                        <path
                            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
                </svg>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 transform-gpu -z-10 size-full overflow-hidden blur-3xl animate-pulse"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            animation: "subtleMove infinite ease-in-out alternate",
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] bg-gradient-to-tr from-secondary to-primary opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] size-full origin-bottom"
                    />
                </div>
                <div className="min-h-screen flex gap-16 lg:gap-0 flex-col-reverse lg:flex-row lg:items-center lg:justify-between container">
                    <div className="aspect-square relative size-full max-w-md mx-auto lg:mx-0 lg:max-w-xl">
                        <img
                            src="/images/hero/small-cloud.svg"
                            className="absolute size-full"
                            style={{ animation: "driftLeftRight 15s ease-in-out infinite alternate 10s" }}
                        />
                        <img
                            src="/images/hero/big-cloud.svg"
                            className="absolute size-full"
                            style={{ animation: "driftLeftRight 20s ease-in-out infinite alternate-reverse" }}
                        />
                        <img
                            src="/images/hero/jumping-guy.svg"
                            className="absolute h-full"
                            style={{ animation: "floatUpDown 12s ease-in-out infinite" }}
                        />
                    </div>
                    <div className="mt-36 lg:mt-0 px-2 sm:px-12">
                        <div className="text-center">
                            <h1
                                className="text-4xl font-semibold tracking-tight text-balance lg:text-6xl hyphens-manual"
                                dangerouslySetInnerHTML={
                                    {
                                        __html: t("content.headline") as string
                                    }
                                }
                            />
                            <p className="mt-8 text-gray text-pretty text-sm lg:text-base">
                                {
                                    t("content.subheadline")
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
