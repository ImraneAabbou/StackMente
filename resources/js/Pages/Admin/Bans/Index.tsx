import Prohibited from "@/Components/icons/Prohibited";
import Refresh from "@/Components/icons/Refresh";
import Trash from "@/Components/icons/Trash";
import VerticalDots from "@/Components/icons/VerticalDots";
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import Input from "@/Components/ui/Input";
import ConfirmDeleteUserCtx from "@/Contexts/ConfirmDeleteUserCtx";
import AdminLayout from "@/Layouts/AdminLayout";
import { avatar } from "@/Utils/helpers/path";
import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormEvent, useContext, useState } from "react";

export default function AdminBansIndex() {
    const { t } = useLaravelReactI18n()
    const { banned_users: { items, next_page_url } } = usePage().props
    const fixedFormat = useFixedDateFormat()
    const { setAction } = useContext(ConfirmDeleteUserCtx)
    const [users, setUsers] = useState(items)
    const { data, setData, get } = useForm({
        q: route().params.q
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        get(route(route().current() as string, { q: data.q }))
    }

    return <AdminLayout>
        <div className="flex sm:flex-row flex-col gap-8 justify-between sm:items-center">
            <div className="flex flex-col">
                <h1 className="text-2xl font-display">{t("content.banned_users_title")}</h1>
                <p className="text-secondary">{t("content.banned_users_desc")}</p>
            </div>
            <form className="flex justify-end ms-auto gap-2 grow max-w-sm" onSubmit={handleSubmit}>
                <Input
                    type="search"
                    className="w-full"
                    placeholder={t("reports.search_placeholder") as string}
                    onChange={e => setData("q", e.target.value)}
                    value={data.q}
                />
            </form>
        </div>

        <section className="mt-8">
            {
                !users.length
                    ?
                    <div className="text-secondary text-xl flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <Prohibited size={64} />
                            {t("content.no_bans_found")}
                        </div>
                    </div>
                    : <table className="min-w-full divide-y divide-secondary/25">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">{t("content.user")}</th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0 hidden sm:table-cell">{t("content.banned_at")}</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/25">
                            {users.map(b => (
                                <tr key={b.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                                        <div className="flex gap-2">
                                            <Link href={route("profile.show", { user: b.username })}>
                                                <img src={avatar(b.avatar)} className="rounded-full size-12 sm:size-16" />
                                            </Link>
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-sm">{b.fullname}</p>
                                                <p className="text-secondary text-xm">{b.username}</p>
                                                <p className="text-secondary text-xs">{b.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0 hidden sm:table-cell">
                                        {fixedFormat(b.deleted_at)}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
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
                                                        href={route("profile.unban", { user: b.username })}
                                                        preserveState="errors"
                                                        method="delete"
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark">
                                                        <Refresh size={16} />
                                                        {t("content.unban")}
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => setAction(route("users.delete", { user: b.username }))}
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
                        p => { setUsers([...users, ...p.banned_users.items]) }
                    }
                    className='text-xs text-secondary text-center select-none p-1'
                >
                    {
                        t("content.loading_more")
                    }
                </InfiniteScrollLoader>
            }
        </section>

    </AdminLayout>
}
