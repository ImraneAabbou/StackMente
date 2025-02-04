import Notifications from '@/Components/icons/Notifications'
import Input from '@/Components/ui/Input'
import { ProgressCircle } from '@/Components/ui/ProgressCircle'
import { avatar } from '@/Utils/helpers/path'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, usePage, usePoll } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { FormEvent } from 'react'
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

export default function Nav() {
    const { t } = useLaravelReactI18n()
    const { auth: { user } } = usePage().props

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault()
    }

    const handleSearchChange = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <nav className="sticky bg-background-light/50 dark:bg-background-dark/50 backdrop-blur top-0">
            <div className="container">
                <div className="relative flex gap-4 h-16 items-center justify-between">
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
                                className='w-full'
                                type="search"
                                placeholder={t("content.looking_for") as string}
                            />
                        </form>
                    </div>
                    <div className="inset-y-0 right-0 flex gap-4 items-center">
                        <Menu as="div" className="relative">
                            <MenuButton className="relative flex rounded-full text-sm">
                                <button
                                    type="button"
                                    className="relative rounded-full p-1 text-gray"
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
                                    <ProgressCircle size={50} value={user.stats.xp.percent_to_next_level}>
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
                                className="absolute bg-input-light dark:bg-input-dark right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
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

                                                <span className='text-xs text-gray ms-4'>/ {user.stats.xp.curr_level_total}</span>
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
        className="flex flex-col gap-1 absolute max-h-80 overflow-y-scroll bg-input-light dark:bg-input-dark right-0 z-10 mt-2 w-screen max-w-xs origin-top-right rounded-md bg-white shadow-lg data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
    >
        <MenuItem>
            <div className='text-xs flex justify-between px-2 items-center sticky inset-0 bg-input-light dark:bg-input-dark p-1'>
                <span className="text-gray">
                    {t("content.notifications")}
                </span>
                <Link
                    href={route("notifications.destroy")}
                    method="delete"
                    className="text-gray p-0.5 px-1 rounded"
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
            <InfiniteScrollLoader url={next_page_url} className='text-xs text-gray text-center select-none p-1'>
                {
                    t("content.loading_more")
                }
            </InfiniteScrollLoader>
        }
    </MenuItems >
}
