import AdminLayout from "@/Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Colors, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useContext, useState } from "react";
import ThemeCtx from "@/Contexts/ThemeCtx";
import { MONTHLY, YEARLY } from "@/Enums/Period";
import Select from "@/Components/ui/Select";
import { FormattedNumber } from "react-intl";

ChartJS.register(
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
    const { analysis } = usePage().props
    const { t } = useLaravelReactI18n()
    const { isDark } = useContext(ThemeCtx)
    const [period, setPeriod] = useState(YEARLY)

    console.log(analysis)

    return <AdminLayout>
        <h1 className="text-2xl font-display">{t("content.users")}</h1>
        <div className="flex flex-col gap-8 lg:items-center lg:flex-row mt-8">

            <div className="flex lg:flex-col flex-wrap gap-4 grow lg:max-w-sm">
                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow">
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

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow">
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

                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl grow">
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

            <div className="flex flex-col grow">
                <Select className="self-end" value={period} onChange={e => setPeriod(e.target.value)}>
                    {
                        [MONTHLY, YEARLY].map(
                            p => <option value={p} key={p}>{t("analysis." + p)}</option>
                        )
                    }
                </Select>
                <Line
                    data={{
                        labels: Object.keys(analysis.users.registrations[period]),
                        datasets: [
                            {
                                label: t("analysis.total_users_title") as string,
                                data: Object.values(analysis.users.registrations[period]),
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
                                text: 'Users registrations',
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
    </AdminLayout>;
}
