import AchievementItem from "@/Components/AchievementItem";
import Pencil from "@/Components/icons/Pencil";
import Trash from "@/Components/icons/Trash";
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { useContext } from "react";

export default function AdminMissionIndex() {
    const { t } = useLaravelReactI18n()
    const { missions } = usePage().props
    const { setAction } = useContext(ConfirmDeleteCtx)

    return <AdminLayout>
        <section>
            <div className="flex sm:flex-row flex-col gap-8 justify-between sm:items-center">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-display">{t("content.missions_title")}</h1>
                    <p className="text-secondary">{t("content.missions_desc")}</p>
                </div>
                <div className="flex justify-end ms-auto gap-2">
                    <Link
                        href={route("missions.create")}
                        className="flex shrink-0 justify-center rounded-md bg-primary text-onPrimary px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                    >
                        {t("content.create")}
                    </Link>
                </div>
            </div>
            <ul className="mt-16 flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12">
                {
                    missions.map(m =>
                        <li key={m.id} className="group p-12 border-2 border-secondary/10 hover:border-secondary/25 rounded relative">
                            <AchievementItem mission={m} />
                            <div className="hidden group-hover:flex gap-4 absolute -top-3 end-2">
                                <button
                                    onClick={() => setAction(route("missions.destroy", {mission : m.id}))}
                                    className="bg-background-light px-0.5 dark:bg-background-dark text-secondary/25 hover:text-error-light dark:hover:text-error-dark"
                                >
                                    <Trash size={16} />
                                </button>
                                <Link
                                    href={route("missions.edit", { mission: m })}
                                    className="bg-background-light px-0.5 dark:bg-background-dark text-secondary/25 hover:text-secondary"
                                >
                                    <Pencil size={16} />
                                </Link>
                            </div>
                        </li>
                    )
                }
            </ul>
        </section>
    </AdminLayout>
}

