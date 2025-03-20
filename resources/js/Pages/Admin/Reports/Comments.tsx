import Flag from "@/Components/icons/Flag";
import VerticalDots from "@/Components/icons/VerticalDots";
import AdminLayout from "@/Layouts/AdminLayout";
import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { useContext, useState } from "react";
import type { CommentReport } from "@/types/report";
import Comments from "@/Components/icons/Comments";
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import { FormattedNumber } from "react-intl";
import Trash from "@/Components/icons/Trash";
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import Minus from "@/Components/icons/Minus";
import SearchInput from "./_Common/SearchInput";


type GrouppedCommentReport = CommentReport & {
    reports_count: number
}

export default function AdminReportsComments() {
    const { setAction } = useContext(ConfirmDeleteCtx)
    const { reports: { items: reportItems, next_page_url } } = usePage().props
    const [reports, setReports] = useState(reportItems as GrouppedCommentReport[])
    const { t } = useLaravelReactI18n()
    const fixedFormat = useFixedDateFormat()

    return <AdminLayout>
        <div className="flex sm:flex-row flex-col gap-8 justify-between sm:items-center">
            <div className="flex flex-col">
                <h1 className="text-2xl font-display">{t("reports.reported_comments_title")}</h1>
                <p className="text-secondary">{t("reports.reported_comments_desc")}</p>
            </div>
            <SearchInput />
        </div>
        <section className="mt-8">
            {
                !reports.length
                    ?
                    <div className="text-secondary text-xl flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <Flag size={64} />
                            {t("content.no_reports_found")}
                        </div>
                    </div>
                    : <table className="min-w-full divide-y divide-secondary/25">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 text-left text-sm font-semibold">{t("content.comment_by")}</th>
                                <th scope="col" className="py-3.5 text-left text-sm font-semibold hidden sm:table-cell">{t("reports.last_report_date")}</th>
                                <th scope="col" className="py-3.5 text-sm font-semibold hidden sm:table-cell">{t("reports.reports_count")}</th>
                                <th scope="col" className="relative py-3.5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/25">
                            {reports.map(r => (
                                <tr key={r.id}>
                                    <td className="whitespace-nowrap py-4 text-sm font-semibold">
                                        <a
                                            target="_blank"
                                            href={route(`${r.reportable.post.type.toLowerCase()}s.show`, { post: r.reportable.post.slug }) + `#comment-${r.reportable_id}`}
                                        >
                                            {r.reportable.user?.fullname ?? "Someone"}
                                        </a>
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-sm font-medium hidden sm:table-cell">
                                        {fixedFormat(r.created_at)}
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-sm text-center font-medium hidden sm:table-cell">
                                        <FormattedNumber value={r.reports_count} style="decimal" notation="compact" />
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-0">
                                        <Menu as="div">
                                            <MenuButton className="py-1.5 px-3">
                                                <VerticalDots />
                                            </MenuButton>

                                            <MenuItems
                                                anchor="bottom end"
                                                className="w-52 origin-top-right rounded-md bg-surface-light dark:bg-surface-dark p-1 text-sm/6"
                                            >
                                                <MenuItem>
                                                    <Link
                                                        href={
                                                            route(
                                                                "reports.comments.messages",
                                                                { reportable: r.reportable.id }
                                                            )
                                                        }
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark"
                                                    >
                                                        <Comments size={16} />
                                                        {t("reports.show_messages")}
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={
                                                            () => setAction(
                                                                route(
                                                                    "comments.clearReports",
                                                                    { reportable: r.reportable.id }
                                                                )
                                                            )
                                                        }
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark text-error-light dark:text-error-dark">
                                                        <Minus size={16} />
                                                        {t("content.clear_reports")}
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => setAction(route("comments.destroy", { comment: r.reportable.id }))}
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark text-error-light dark:text-error-dark">
                                                        <Trash size={16} />
                                                        {t("content.delete")}
                                                    </button>
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            }
            {
                next_page_url &&
                <InfiniteScrollLoader
                    url={next_page_url}
                    onSuccess={
                        p => { setReports([...reports, ...(p.reports.items as GrouppedCommentReport[])]) }
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
