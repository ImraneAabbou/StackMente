import Comments from "@/Components/icons/Comments";
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import Select from "@/Components/ui/Select";
import AdminLayout from "@/Layouts/AdminLayout";
import { ReportReason, UserReport } from "@/types/report";
import { avatar } from "@/Utils/helpers/path";
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat";
import { Link, router, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { useState } from "react";
import {
    FALSE_INFORMATION,
    SPAM_OR_SCAM,
    CHEATING,
    INAPPROPRIATE_CONTENT,
    OFFENSIVE_LANGUAGE,
    OTHER,
} from "@/Enums/ReportReason"
import clsx from "clsx";

export default function AdminReportMessages() {
    const { count_items, reportableWithMessages: { items: initialMessages, next_page_url } } = usePage().props
    const [messages, setMessages] = useState(initialMessages)
    const { t } = useLaravelReactI18n()
    const relDateTime = useRelativeDateFormat()
    const isFilterReasonApplied = !!(route().params?.reason);

    return <AdminLayout>
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-8">
            <div className="flex flex-col">
                <h1 className="text-2xl font-display">{t("reports.messages_title")}</h1>
                <p className="text-secondary">{t("reports.messages_desc")}</p>
            </div>
            <div className="ms-auto sm:ms-0">
                <Select
                    onChange={(e) => router.visit(route(route().current() as string, { ...(route().params), reason: e.target.value }))}
                    value={(route().params?.reason) ?? ""}
                >
                    <option value=""></option>
                    <option value={CHEATING}>{t("reports." + CHEATING)} ({count_items[CHEATING]})</option>
                    <option value={FALSE_INFORMATION}>{t("reports." + FALSE_INFORMATION)} ({count_items[FALSE_INFORMATION]})</option>
                    <option value={SPAM_OR_SCAM}>{t("reports." + SPAM_OR_SCAM)} ({count_items[SPAM_OR_SCAM]})</option>
                    <option value={OFFENSIVE_LANGUAGE}>{t("reports." + OFFENSIVE_LANGUAGE)} ({count_items[OFFENSIVE_LANGUAGE]})</option>
                    <option value={INAPPROPRIATE_CONTENT}>{t("reports." + INAPPROPRIATE_CONTENT)} ({count_items[INAPPROPRIATE_CONTENT]})</option>
                    <option value={OTHER}>{t("reports." + OTHER)} ({count_items[OTHER]})</option>
                </Select>
            </div>
        </div>
        <section className="mt-8">
            {
                !messages.length
                    ?
                    <div className="text-secondary text-xl flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <Comments size={64} />
                            {t("content.nothing_found")}
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
                                                {m.user?.fullname ?? t("content.someone")}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex flex-col">
                                        <span className={clsx("text-sm italic text-secondary", isFilterReasonApplied && "hidden")}>
                                            {t("reports." + m.reason)}
                                        </span>
                                        <span className="text-sm italic text-secondary">{relDateTime(m.created_at)}</span>
                                    </div>
                                </div>
                                <bdi className="">{m.explanation}</bdi>
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
