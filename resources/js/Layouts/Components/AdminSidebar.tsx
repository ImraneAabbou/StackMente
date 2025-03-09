import { ReactNode, useState } from 'react'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'
import { avatar } from '@/Utils/helpers/path'
import { Link, usePage } from '@inertiajs/react'
import Dashboard from '@/Components/icons/Dashboard'
import Prohibited from '@/Components/icons/Prohibited'
import Flag from '@/Components/icons/Flag'
import Medal from '@/Components/icons/Medal'


function NavigationLinks() {
    const navigation = [
        {
            name: 'Dashboard',
            href: route("admin.index"),
            icon: <Dashboard size={16} />,
            current: route().current("admin.index")
        },
        {
            name: 'Missions',
            href: route("missions.index"),
            icon: <Medal size={16} />,
            current: route().current("missions.*")
        },
        {
            name: 'Bans',
            href: route("admin.bans"),
            icon: <Prohibited size={16} />,
            current: route().current("admin.bans")
        },
        {
            name: 'Reports',
            links: [
                { href: route("reports.users"), name: "Users", current: route().current("reports.users") },
                { href: route("reports.articles"), name: "Articles", current: route().current("reports.articles") },
                { href: route("reports.subjects"), name: "Subjects", current: route().current("reports.subjects") },
                { href: route("reports.questions"), name: "Questions", current: route().current("reports.questions") },
                { href: route("reports.comments"), name: "Comments", current: route().current("reports.comments") },
                { href: route("reports.replies"), name: "Replies", current: route().current("reports.replies") },
            ],
            icon: <Flag size={16} />,
            current: route().current("reports.*")
        },
    ]
    return <ul role="list" className="-mx-2 space-y-1">
        {navigation.map((item) => (
            <li key={item.name}>
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
                                                'text-xs group ms-6 flex gap-2 items-center rounded-md p-2 font-semibold'
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
    const { auth: { user } } = usePage().props

    return (
        <>
            <div>
                <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
                    <div className="fixed inset-0 bg-gray-900/80" />

                    <div className="fixed inset-0 flex">
                        <div className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                    <span className="sr-only">Close sidebar</span>
                                    <></>
                                </button>
                            </div>
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src={"/favicon.ico"}
                                        alt="StackMente"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <NavigationLinks />
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary/25 px-6">
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                className="h-8 w-auto"
                                src={"/favicon.ico"}
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <NavigationLinks />
                                </li>
                                <li className="-mx-6 mt-auto">
                                    <Link
                                        href={route("profile.index")}
                                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6"
                                    >
                                        <img
                                            className="size-8 rounded-full"
                                            src={avatar(user.avatar)}
                                        />
                                        <span className="sr-only">Your profile</span>
                                        <span aria-hidden="true">{user.fullname}</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <button type="button" className="-m-2.5 p-2.5 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <></>
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6">Dashboard</div>
                    <Link href={route("profile.index")}>
                        <span className="sr-only">Your profile</span>
                        <img
                            className="h-8 w-8 rounded-full"
                            src={avatar(user.avatar)}
                        />
                    </Link>
                </div>
                <main className="py-10 lg:ps-72">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </>
    )
}
