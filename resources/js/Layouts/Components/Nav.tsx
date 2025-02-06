import Notifications from '@/Components/icons/Notifications'
import Input from '@/Components/ui/Input'
import { ProgressCircle } from '@/Components/ui/ProgressCircle'
import { avatar } from '@/Utils/helpers/path'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useForm, usePage, usePoll } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { ChangeEvent, FormEvent } from 'react'
import { useState } from "react"
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import {
    POST_VOTE_RECEIVED,
    COMMENT_MARKED,
    COMMENT_RECEIVED,
    COMMENT_VOTE_RECEIVED,
    MISSION_ACCOMPLISHED,
    REPLY_RECEIVED
} from "@/Enums/NotificationType"
import {
    CommentReceived,
    CommentVoteReceived,
    PostVoteReceived,
    ReplyReceived,
    MissionAccomplished,
    CommentMarked
} from "@/Components/NotificationItems";
import type { Notification } from '@/types/notification'
import { RouteName } from '../../../../vendor/tightenco/ziggy/src/js'

const SEARCHABLE_ROUTE_NAMES: RouteName[] = ["tags.index", "feed", "questions.index", "articles.index", "subjects.index"]

export default function Nav() {
    const { t } = useLaravelReactI18n()
    const { auth: { user } } = usePage().props
    const {data, setData, get} = useForm(`SearchBar`, {
        q: ""
    })
    const searchAction = SEARCHABLE_ROUTE_NAMES.includes(route().current() as string)
        ? route(route().current() as string)
        : route("search")

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault()
        get(searchAction)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setData("q", e.target.value)
    }

    return (
        <nav className="sticky bg-background-light/50 dark:bg-background-dark/50 backdrop-blur top-0">
            <div className="container">
                <div className="flex gap-4 h-16 items-center justify-between">
                    <div className="flex flex-1 gap-4 items-center">
                        <Link href="#" className="flex shrink-0 items-center">
                            <img
                                alt="StackMente"
                                src="/favicon.ico"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <form onSubmit={handleSearchSubmit} className='w-full max-w-sm'>
                            <Input
                                onChange={handleSearchChange}
                                value={data.q}
                                className='w-full'
                                type="search"
                                placeholder={t("content.looking_for") as string}
                            />
                        </form>
                    </div>
                    <div className="inset-y-0 flex gap-4 items-center">
                        {
                            !!user
                                ? <>
                                    <Menu as="div" className="relative">
                                        <MenuButton className="flex rounded-full text-sm">
                                            <button
                                                type="button"
                                                className="rounded-full p-1 text-secondary"
                                            >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                                <Notifications size={24} />
                                            </button>
                                        </MenuButton>
                                        <NotificationsItems />
                                    </Menu>
                                    <Menu as="div" className="relative">
                                        <div>
                                            <MenuButton className="relative flex rounded-full text-sm">
                                                <ProgressCircle size={48} value={user.stats.xp.percent_to_next_level}>
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        alt=""
                                                        src={avatar(user.avatar)}
                                                        className="rounded-full"
                                                    />
                                                </ProgressCircle>
                                            </MenuButton>
                                        </div>
                                        <MenuItems
                                            className="absolute bg-surface-light dark:bg-surface-dark right-0 z-10 mt-2 w-64 origin-top-right rounded-md py-1 shadow-lg"
                                        >
                                            <MenuItem>
                                                <div
                                                    className="flex px-4 py-2 text-sm gap-4"
                                                >
                                                    <ProgressCircle size={50} value={user.stats.xp.percent_to_next_level}>
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        <img
                                                            alt=""
                                                            src={avatar(user.avatar)}
                                                            className="rounded-full"
                                                        />
                                                    </ProgressCircle>
                                                    <div>
                                                        <div className='flex flex-col'>
                                                            <span className='font-bold'>{user.stats.xp.curr_level_total}</span>

                                                            <span className='text-xs text-secondary ms-4'>/ {user.stats.xp.next_level_total}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                            <MenuItem>
                                                <a
                                                    href="#2"
                                                    className="block hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm"
                                                >
                                                    Settings
                                                </a>
                                            </MenuItem>
                                            <MenuItem>
                                                <a
                                                    href="#3"
                                                    className="block hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm"
                                                >
                                                    Sign out
                                                </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </Menu>
                                </>
                                : <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        {t("content.login")}
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="rounded-md px-3.5 py-2.5 bg-secondary/25 hover:bg-secondary/50 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        {t("content.register")}
                                    </Link>
                                </>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}


const NotificationsItems = () => {
    const {
        notifications: { items: notifications, next_page_url }
    } = usePage().props
    const { t } = useLaravelReactI18n()
    const [lastNotificationTime, setLastNotificationTime] = useState(notifications[0]?.created_at)

    if (
        (!!notifications[0]) && (notifications[0].created_at != lastNotificationTime)
    ) {
        setLastNotificationTime(notifications[0].created_at)
        alert(`new notification came`)
    }

    usePoll(5000, {
        only: ["notifications"],
    })

    return <MenuItems
        className="
                flex flex-col gap-1 w-screen mt-4 left-0 sm:left-auto
                fixed right-0 z-10 h-[calc(100vh-100%)] sm:max-h-96
                overflow-y-auto bg-surface-light dark:bg-surface-dark
                sm:absolute sm:max-w-xs sm:mt-4 sm:rounded-md sm:shadow-lg
            "
    >
        <MenuItem>
            <div className='text-xs flex justify-between px-2 items-center sticky inset-0 bg-surface-light dark:bg-surface-dark p-1'>
                <span className="text-secondary">
                    {t("content.notifications")}
                </span>
                <Link
                    href={route("notifications.destroy")}
                    method="delete"
                    className="text-secondary p-0.5 px-1 rounded"
                >
                    {t("content.mark_all_read")}
                </Link>
            </div>
        </MenuItem>
        {
            notifications.map(
                (n: Notification) => {

                    switch (n.type) {
                        case POST_VOTE_RECEIVED:
                            return <MenuItem
                                key={n.id}
                            >
                                <PostVoteReceived notification={n} />
                            </MenuItem>

                        case COMMENT_VOTE_RECEIVED:
                            return <MenuItem
                                key={n.id}
                            >
                                <CommentVoteReceived notification={n} />
                            </MenuItem>

                        case COMMENT_RECEIVED:
                            return <MenuItem
                                key={n.id}
                            >
                                <CommentReceived notification={n} />
                            </MenuItem>

                        case REPLY_RECEIVED:
                            return <MenuItem
                                key={n.id}
                            >
                                <ReplyReceived notification={n} />
                            </MenuItem>

                        case MISSION_ACCOMPLISHED:
                            return <MenuItem
                                key={n.id}
                            >
                                <MissionAccomplished notification={n} />
                            </MenuItem>

                        case COMMENT_MARKED:
                            return <MenuItem
                                key={n.id}
                            >
                                <CommentMarked notification={n} />
                            </MenuItem>
                    }
                }
            )
        }
        {
            next_page_url &&
            <InfiniteScrollLoader url={next_page_url} className='text-xs text-secondary text-center select-none p-1'>
                {
                    t("content.loading_more")
                }
            </InfiniteScrollLoader>
        }
    </MenuItems >
}
