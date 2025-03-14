import AdminLayout from "@/Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Colors, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from "chart.js";
import { useContext, useState } from "react";
import ThemeCtx from "@/Contexts/ThemeCtx";
import { MONTHLY, YEARLY } from "@/Enums/Period";
import Select from "@/Components/ui/Select";
import { FormattedNumber } from "react-intl";
import { PostType } from "@/types/post";
import { ARTICLE, QUESTION, SUBJECT } from "@/Enums/PostType";

ChartJS.register(
    ArcElement,
    BarElement,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export default function AdminIndex() {
    return <AdminLayout>
        <div className="flex flex-col gap-12">
            <Registrations />
            <Publications />
            <ResourcesUsage />
        </div>
    </AdminLayout>;
}

function Registrations() {
    const { analysis: { system_usage, ...analysis } } = usePage().props
    const { t } = useLaravelReactI18n()
    const { isDark } = useContext(ThemeCtx)
    const [registrationsPeriod, setRegistrationsPeriod] = useState<typeof MONTHLY | typeof YEARLY>(MONTHLY)

    return <section>
        <h1 className="text-2xl font-display">{t("content.users")}</h1>
        <div className="flex flex-col gap-8 lg:justify-around lg:flex-row mt-8">

            <div className="flex lg:flex-col flex-wrap gap-4 grow lg:max-w-sm">
                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_users_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_users_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.users.total_users} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_admin_users_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_admin_users_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.users.total_admins} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_banned_users_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_banned_users_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.users.total_banned_users} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex flex-col grow bg-surface-light dark:bg-surface-dark p-4 rounded-xl lg:max-w-2xl">
                <Select className="self-end" value={registrationsPeriod} onChange={e => setRegistrationsPeriod(e.target.value as (typeof YEARLY | typeof MONTHLY))}>
                    {
                        [MONTHLY, YEARLY].map(
                            p => <option value={p} key={p}>{t("analysis." + p)}</option>
                        )
                    }
                </Select>
                <Line
                    data={{
                        labels: Object.keys(analysis.users.registrations[registrationsPeriod]),
                        datasets: [
                            {
                                label: t("analysis.total_users_title") as string,
                                data: Object.values(analysis.users.registrations[registrationsPeriod]),
                                tension: 0.25,
                                pointRadius: 5,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: t("analysis.users_registrations") as string,
                                color: isDark ? "#ffffff" : "#000000",
                            },
                            legend: {
                                display: false
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: "#a1a1a1f5"
                                },
                                grid: {
                                    color: "#a1a1a1f5"
                                },
                                border: { display: false },
                            },
                            y: {
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                            },
                        }
                    }}
                />
            </div>
        </div>
    </section>
}


function ResourcesUsage() {
    const { analysis: { system_usage } } = usePage().props
    const { t } = useLaravelReactI18n()
    const { isDark } = useContext(ThemeCtx)

    return <section>
        <h1 className="text-2xl font-display">{t("analysis.resources_usage")}</h1>
        <div className="flex flex-col gap-8 lg:flex-row justify-around mt-8 bg-surface-light dark:bg-surface-dark  p-4 rounded-xl">

            <div className="flex items-center flex-row-reverse justify-center gap-12">
                <div className="flex flex-col gap-2  text-xs">
                    <div>
                        <span className="font-bold">
                            {t("analysis.ram_total")}:{" "}
                        </span>
                        {system_usage.ram_total}
                    </div>
                    <div>
                        <span className="font-bold">
                            {t("analysis.ram_usage")}:{" "}
                        </span>
                        {system_usage.ram_usage} {" "}
                        <span className="text-2xs">
                            ({system_usage.ram_usage_percent}%)
                        </span>
                    </div>
                    <div>

                        <span className="font-bold">
                            {t("analysis.ram_free")}:{" "}
                        </span>
                        {system_usage.ram_free} {" "}
                        <span className="text-2xs">
                            ({system_usage.ram_free_percent}%)
                        </span>
                    </div>
                </div>
                <Bar
                    className="max-w-32 h-80 max-h-80"
                    data={{
                        labels: [t("analysis.ram_usage_title")],
                        datasets: [
                            {
                                data: [system_usage.ram_usage_percent],
                                backgroundColor:
                                    system_usage.disk_usage_percent >= 75 ? "#FF0D01af"
                                        :
                                        system_usage.disk_usage_percent >= 50 ? "#FFED01a5"
                                            : "#00ff0092",
                                stack: "ram",
                            },
                            {
                                data: [system_usage.ram_free_percent],
                                backgroundColor: '#b1b1b175',
                                stack: "ram",
                            },
                        ],
                    }}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: t("analysis.ram_usage_title") as string,
                                color: isDark ? "#ffffff" : "#000000",
                            },
                            legend: {
                                align: "start",
                                display: false,
                                labels: {
                                    color: isDark ? "#ffffff" : "#000000",
                                },
                            },
                            tooltip: {
                                enabled: false
                            },
                        },
                        scales: {
                            y: {
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                                border: { display: false },
                            },
                            x: {
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                                border: { display: false },
                            },
                        }
                    }}
                />
            </div>

            <div className="flex flex-col items-center grow p-4 rounded-xl lg:max-w-lg">
                <Pie
                    data={{
                        labels: [
                            t("analysis.disk_usage", { n: system_usage.disk_usage }),
                            t("analysis.disk_free", { n: system_usage.disk_free })
                        ] as string[],
                        datasets: [
                            {
                                data: [system_usage.disk_usage_percent, system_usage.disk_free_percent],
                                backgroundColor: [
                                    system_usage.disk_usage_percent >= 75 ? "#FF0D01af"
                                        :
                                        system_usage.disk_usage_percent >= 50 ? "#FFED01a5"
                                            : "#0000ff52",
                                    "#b1b1b175"
                                ],
                            },
                        ]
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: t("analysis.disk_usage_title") as string,
                                color: isDark ? "#ffffff" : "#000000",
                            },
                            legend: {
                                labels: {
                                    color: isDark ? "#ffffff" : "#000000",
                                },
                                position: "left",
                            },
                            tooltip: {
                                callbacks: {
                                    label: () => "",
                                }
                            }
                        },
                    }}
                />
            </div>
        </div>
    </section>
}

function Publications() {
    const { analysis: { system_usage, ...analysis } } = usePage().props
    const { t } = useLaravelReactI18n()
    const [publicationsPeriod, setPublicationsPeriod] = useState<typeof MONTHLY | typeof YEARLY>(MONTHLY)
    const [publicationsType, setPublicationsType] = useState<PostType>(QUESTION)
    const { isDark } = useContext(ThemeCtx)

    return <section>
        <h1 className="text-2xl font-display">{t("content.posts")}</h1>
        <div className="flex flex-col gap-8 lg:justify-around lg:flex-row-reverse mt-8">

            <div className="flex lg:flex-col flex-wrap gap-4 grow lg:max-w-sm">
                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_posts_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_posts_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.posts.total_posts} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_articles_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_articles_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.posts.total_articles} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_subjects_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_subjects_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.posts.total_subjects} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow lg:grow-0">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="max-w-48">
                            <h3 className="font-bold">{t("analysis.total_questions_title")}</h3>
                            <p className="text-secondary text-xs">{t("analysis.total_questions_desc")}</p>
                        </div>
                        <div className="flex gap-2 font-bold text-lg">

                            <span className="text flex gap-1 items-center">
                                <FormattedNumber value={analysis.posts.total_questions} style="decimal" notation="compact" />
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex flex-col grow bg-surface-light dark:bg-surface-dark p-4 rounded-xl lg:max-w-2xl">
                <div className="flex flex-wrap gap-2 ms-auto mb-8">
                    <Select value={publicationsType} onChange={e => setPublicationsType(e.target.value as PostType)}>
                        {
                            [ARTICLE, SUBJECT, QUESTION].map(
                                p => <option value={p} key={p}>{t("content." + p.toLowerCase() + "s")}</option>
                            )
                        }
                    </Select>
                    <Select value={publicationsPeriod} onChange={e => setPublicationsPeriod(e.target.value as (typeof YEARLY | typeof MONTHLY))}>
                        {
                            [MONTHLY, YEARLY].map(
                                p => <option value={p} key={p}>{t("analysis." + p)}</option>
                            )
                        }
                    </Select>
                </div>
                <Line
                    data={{
                        labels: Object.keys(analysis.posts.publications[publicationsType][publicationsPeriod]),
                        datasets: [
                            {
                                label: t(`analysis.total_${publicationsType.toLowerCase()}s_title`) as string,
                                data: Object.values(analysis.posts.publications[publicationsType][publicationsPeriod]),
                                tension: 0.25,
                                pointRadius: 5,
                                backgroundColor: "#54BF59",
                                borderColor: "#54BF59",
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: t("analysis.publications") as string,
                                color: isDark ? "#ffffff" : "#000000",
                            },
                            legend: {
                                position: "bottom",
                                labels: {
                                    color: isDark ? "#ffffff" : "#000000",
                                }
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: "#a1a1a1f5"
                                },
                                grid: {
                                    color: "#a1a1a1f5"
                                },
                                border: { display: false },
                            },
                            y: {
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                            },
                        }
                    }}
                />
            </div>
        </div>
    </section>
}
