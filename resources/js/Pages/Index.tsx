import Comments from "@/Components/icons/Comments"
import Facebook from "@/Components/icons/Facebook"
import Github from "@/Components/icons/Github"
import Instagram from "@/Components/icons/Instagram"
import Medal from "@/Components/icons/Medal"
import Rank from "@/Components/icons/Rank"
import LangSelect from "@/Components/LangSelect"
import { Link, usePage } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { FormattedNumber } from "react-intl"

const socials = [
    {
        name: 'Facebook',
        href: '#',
        icon: <Facebook />,
    },
    {
        name: 'Instagram',
        href: '#',
        icon: <Instagram />,
    },
    {
        name: 'GitHub',
        href: '#',
        icon: <Github />,
    },
]
export default function Index() {
    const { t } = useLaravelReactI18n()
    const { hero_stats: stats, auth: { user } } = usePage().props

    const features = [
        {
            name: t("content.feature_1_title"),
            description: t("content.feature_1_desc"),
            icon: <Medal />,
        },
        {
            name: t("content.feature_2_title"),
            description: t("content.feature_2_desc"),
            icon: <Comments />,
        },
        {
            name: t("content.feature_3_title"),
            description: t("content.feature_3_desc"),
            icon: <Rank />,
        },
    ]

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
                        transform: translateY(0) rotate(-2.5deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(2.5deg);
                    }
                }

                @keyframes driftLeftRight {
                    0%, 100% {
                        transform: translateX(-25px) translateY(0px) rotate(-2.5deg);
                    }
                    50% {
                        transform: translateX(0px) translateY(-25px) rotate(0deg);
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
                                src="/favicon.svg"
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        {

                            !user
                                ? <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs hover:bg-secondary/10"
                                    >
                                        {t("content.login")}
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="bg-primary shadow-sm hover:bg-primary/90 text-onPrimary rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs"
                                    >
                                        {t("content.register")}
                                    </Link>
                                </>

                                : <Link
                                    href={route("feed")}
                                    className="bg-success-light text-onSuccess-light dark:bg-success-dark dark:text-onSuccess-dark shadow-sm hover:bg-success-light/90 dark:hover:bg-success-dark/90 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs"
                                >
                                    {t("content.to_feed")}
                                </Link>
                        }
                    </div>
                </nav>
            </header>

            <div className="relative isolate pt-14 bg-gradient-to-b from-transparent to-surface-light/75 dark:to-surface-dark/75">
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
                <div className="lg:min-h-[780px] flex gap-16 lg:gap-0 flex-col-reverse lg:flex-row lg:items-center lg:justify-between container" dir="ltr">
                    <div className="aspect-square relative size-full max-w-md mx-auto lg:mx-0 lg:max-w-xl">
                        <img
                            src="/images/hero/small-cloud.svg"
                            className="absolute size-full brightness-90"
                            style={{ animation: "driftLeftRight 15s ease-in-out infinite alternate 10s" }}
                        />
                        <img
                            src="/images/hero/big-cloud.svg"
                            className="absolute size-full brightness-95"
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
                            <p className="mt-8 pretty text-sm lg:text-base">
                                {
                                    t("content.subheadline")
                                }
                            </p>
                        </div>
                        {

                            !user && <div className="flex justify-center mt-8">
                                <Link
                                    href={route("feed")}
                                    className="bg-success-light text-onSuccess-light dark:bg-success-dark dark:text-onSuccess-dark shadow-sm hover:bg-success-light/90 dark:hover:bg-success-dark/90 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs"
                                >
                                    {t("content.to_feed")}
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>


            <div className="bg-gradient-to-b from-surface-light/75 dark:from-surface-dark/75 to-surface-light dark:to-surface-dark text-onSurface-dark dark:text-onSurface-light">
                <div className="container py-16 lg:py-32  flex flex-col gap-32">
                    <div className="flex lg:flex-row-reverse flex-col justify-between items-center gap-16">
                        <img src="/images/hero/winners.svg" className="max-w-sm mx-auto w-full min-w-64" />
                        <div className="max-w-2xl text-center">
                            <h2 className="text-base font-semibold leading-7">{t("content.features_title")}</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                {t("content.features_subtitle")}
                            </p>
                            <p className="mt-6 text-lg leading-8 text-secondary">
                                {t("content.features_desc")}
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto max-w-6xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name as string} className="flex flex-col bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                    <dt className="text-base font-semibold leading-7">
                                        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-onPrimary">
                                            {feature.icon}
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-secondary">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>


                <div className="container py-16 lg:py-32 flex flex-col gap-24 justify-center">
                    <div>
                        <img src="/images/hero/people.svg" className="max-w-sm mx-auto w-full" />
                        <h1 className="text-center text-5xl leading-normal">{t("content.join_our_massive_community")}</h1>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base/7 text-secondary">{t("content.questions_stats_desc")}</dt>
                            <dd className="order-first">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-semibold tracking-tight sm:text-5xl">
                                        <FormattedNumber value={stats.questions_count} style="decimal" notation="compact" />
                                    </span>
                                    <span className="text-4xl">
                                        {t("content.questions")}
                                    </span>
                                </div>
                            </dd>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base/7 text-secondary">{t("content.articles_stats_desc")}</dt>
                            <dd className="order-first">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-semibold tracking-tight sm:text-5xl">
                                        <FormattedNumber value={stats.articles_count} style="decimal" notation="compact" />
                                    </span>
                                    <span className="text-4xl">
                                        {t("content.articles")}
                                    </span>
                                </div>
                            </dd>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base/7 text-secondary">{t("content.subjects_stats_desc")}</dt>
                            <dd className="order-first">
                                <div className="flex flex-col">
                                    <span className=" text-3xl font-semibold tracking-tight sm:text-5xl">
                                        <FormattedNumber value={stats.subjects_count} style="decimal" notation="compact" />
                                    </span>
                                    <span className="text-3xl">
                                        {t("content.subjects")}
                                    </span>
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="container flex flex-col gap-12 py-16 lg:py-32">
                    <h2 className="text-center text-lg lg:text-xl leading-8">
                        {t("content.plateform_supported_by")}
                    </h2>
                    <div className="mx-auto grid max-w-md items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none">
                        <img
                            className="max-h-32 w-full object-contain"
                            src="/images/hero/ofppt.svg"
                            alt="OFPPT"
                            width={158}
                            height={32}
                        />
                        <img
                            className="max-h-32 w-full object-contain"
                            src="/images/hero/cad.png"
                            alt="CAD"
                            width={158}
                            height={32}
                        />
                        <img
                            className="max-h-32 w-full object-contain"
                            src="/images/hero/career-center.png"
                            alt="Career Center"
                            width={158}
                            height={48}
                        />
                    </div>
                </div>
            </div>
            <footer aria-labelledby="footer-heading" className="relative">
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
                    <div className="border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
                        <div className="flex items-center space-x-4 md:order-2">
                            <LangSelect className="me-8" />
                            {socials.map((item) => (
                                <a key={item.name} href={item.href} className="hover:text-secondary transition-colors">
                                    <span className="sr-only">{item.name}</span>
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                        <p className="mt-8 text-xs leading-5 text-secondary md:order-1 md:mt-0">
                            &copy; {(new Date()).getFullYear()} StackMente, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

        </div >
    )
}
