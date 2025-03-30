import { ReactNode, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import clsx from 'clsx'
import { Link, usePage } from '@inertiajs/react'
import Dashboard from '@/Components/icons/Dashboard'
import Prohibited from '@/Components/icons/Prohibited'
import Flag from '@/Components/icons/Flag'
import Medal from '@/Components/icons/Medal'
import UserMenu from '@/Components/UserMenu'
import Menu from '@/Components/icons/Menu'
import DB from '@/Components/icons/DB'
import { useLaravelReactI18n } from 'laravel-react-i18n'


function NavigationLinks() {
    const { t } = useLaravelReactI18n()
    const { auth: { user } } = usePage().props
    const navigation = [
        {
            name: t("content.dashboard"),
            href: route("admin.index"),
            icon: <Dashboard size={16} />,
            current: route().current("admin.index")
        },
        {
            name: t("content.banned_users_title"),
            href: route("admin.bans"),
            icon: <Prohibited size={16} />,
            current: route().current("admin.bans")
        },
        {
            name: t("content.reports"),
            links: [
                { href: route("reports.users"), name: t("content.users"), current: route().current("reports.users") },
                { href: route("reports.posts"), name: t("content.posts"), current: route().current("reports.posts") },
                { href: route("reports.comments"), name: t("content.comments"), current: route().current("reports.comments") },
                { href: route("reports.replies"), name: t("content.replies"), current: route().current("reports.replies") },
            ],
            icon: <Flag size={16} />,
            current: route().current("reports.*")
        },
        ...(
            user.role == "SUPER_ADMIN"
                ? [
                    {
                        name: t("content.missions_title"),
                        href: route("missions.index"),
                        icon: <Medal size={16} />,
                        current: route().current("missions.*")
                    },
                    {
                        name: t("backup.backup_and_restore"),
                        href: route("backups.index"),
                        icon: <DB size={16} />,
                        current: route().current("backups.*")
                    },
                ]
                : []
        )
    ]

    return <ul role="list" className="-mx-2 space-y-1">
        {navigation.map((item) => (
            <li key={item.name as string}>
                {
                    item.links
                    && <span
                        className={clsx(
                            item.current
                                ? "bg-secondary/25"
                                : 'text-secondary hover:text-current',
                            'cursor-pointer flex gap-2 items-center rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                    >
                        {item.icon} {item.name}
                    </span>
                }
                {
                    item.href
                        ? <Link
                            href={item.href}
                            className={clsx(
                                item.current
                                    ? "bg-secondary/25"
                                    : 'text-secondary hover:text-current',
                                'group flex gap-2 items-center rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                        : <ul>
                            {
                                item.links!.map(
                                    l => <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className={clsx(
                                                l.current || 'text-secondary hover:text-current',
                                                'lg:text-xs group ms-6 flex gap-2 items-center rounded-md p-2 font-semibold'
                                            )}
                                        >
                                            {l.name}
                                        </Link>

                                    </li>
                                )
                            }
                        </ul>
                }
            </li>
        ))}
    </ul>
}

export default function AdminSidebar({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return <div>
        <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <DialogBackdrop
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="fixed inset-0 flex h-screen">
                <DialogPanel className="flex">
                    <div className="relative flex w-64 flex-1">
                        <div className="absolute end-full top-0 flex w-16 justify-center pt-5">
                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                <></>
                            </button>
                        </div>
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 bg-surface-light dark:bg-surface-dark">
                            <Link href={route("feed")} className="flex h-16 shrink-0 items-center gap-2">
                                <img
                                    className="h-8 w-auto"
                                    src={"/favicon.ico"}
                                />
                                <div className='font-semibold text-lg'>
                                    StackMente
                                </div>
                            </Link>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <NavigationLinks />
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:z-10">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
                <nav className="flex flex-1 flex-col mt-24">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <NavigationLinks />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <main className="py-10 lg:ps-72">
            <div className="container">
                <div className="fixed z-50 w-full inset-0 h-16 flex items-center justify-between px-4 backdrop-blur">
                    <Link href={route("feed")} className="hidden lg:flex h-16 shrink-0 items-center gap-2">
                        <img
                            className="h-8 w-auto"
                            src={"/favicon.ico"}
                        />
                        <div className='font-semibold text-lg'>
                            StackMente
                        </div>
                    </Link>
                    <button type="button" className="-m-2.5 p-2.5 lg:invisible" onClick={() => setSidebarOpen(true)}>
                        <Menu size={32} />
                    </button>
                    <UserMenu />
                </div>
                <div className='mt-12'>
                    {children}
                </div>
            </div>
        </main>
    </div>
}
