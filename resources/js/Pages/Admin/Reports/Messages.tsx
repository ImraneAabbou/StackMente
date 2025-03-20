import Comments from "@/Components/icons/Comments";
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import AdminLayout from "@/Layouts/AdminLayout";
import { UserReport } from "@/types/report";
import { avatar } from "@/Utils/helpers/path";
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat";
import { Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { useState } from "react";

export default function AdminReportMessages() {
    const { reportableWithMessages: { items: initialMessages, next_page_url } } = usePage().props
    const [messages, setMessages] = useState(initialMessages)
    const { t } = useLaravelReactI18n()
    const relDateTime = useRelativeDateFormat()

    return <AdminLayout>
        <div className="flex flex-col">
            <h1 className="text-2xl font-display">{t("reports.messages_title")}</h1>
            <p className="text-secondary">{t("reports.messages_desc")}</p>
        </div>
        <section className="mt-8">
            {
                !messages.length
                    ?
                    <div className="text-secondary text-xl flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <Comments size={64} />
                            {t("content.no_messages_found")}
                        </div>
                    </div>
                    : <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
                        {
                            messages.map(m => <div className="flex flex-col gap-4 p-4 rounded bg-surface-light dark:bg-surface-dark">
                                <div className="flex justify-between gap-4">
                                    <Link
                                        href={m.user ? route("profile.show", { user: m.user.username }) : ""}
                                        className="flex items-center gap-3"
                                    >
                                        <img src={avatar(m.user?.avatar)} className="size-10 sm:size-12 rounded-full" />
                                        <div>
                                            <div
                                                className={`font-semibold ${m.user ? "" : "text-secondary"}`}
                                            >
                                                {m.user?.fullname ?? "Someone"}
                                            </div>
                                        </div>
                                    </Link>
                                    <span className="text-sm italic text-secondary">{relDateTime(m.created_at)}</span>
                                </div>
                                <p className="">{m.explanation}</p>
                            </div>
                            )
                        }
                    </div>
            }
            {
                next_page_url &&
                <InfiniteScrollLoader
                    url={next_page_url}
                    onSuccess={
                        p => { setMessages([...messages, ...(p.reportableWithMessages.items as UserReport[])]) }
                    }
                    className='text-xs text-secondary text-center select-none p-1'
                >
                    {
                        t("content.loading_more")
                    }
                </InfiniteScrollLoader>
            }
        </section>
    </AdminLayout >
}
