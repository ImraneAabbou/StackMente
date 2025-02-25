import Notifications from '@/Components/icons/Notifications'
import Input from '@/Components/ui/Input'
import { ProgressCircle } from '@/Components/ui/ProgressCircle'
import Switch from '@/Components/ui/Switch'
import { avatar } from '@/Utils/helpers/path'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, router, useForm, usePage, usePoll } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { ChangeEvent, FormEvent, ReactNode, useCallback, useLayoutEffect, useRef } from 'react'
import { debounce } from "lodash"
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
import Plus from '@/Components/icons/Plus'
import QuestionMark from '@/Components/icons/QuestionMark'
import Pencil from '@/Components/icons/Pencil'
import Discuss from '@/Components/icons/Discuss'
import { Results } from '@/types'
import Search from '@/Components/icons/Search'
import Questions from '@/Components/icons/Questions'
import Tags from '@/Components/icons/Tags'
import Articles from '@/Components/icons/Articles'
import Subjects from '@/Components/icons/Subjects'
import Logout from '@/Components/icons/Logout'
import DarkMode from '@/Components/icons/DarkMode'
import useLocalStorageState from 'use-local-storage-state'

const SEARCHABLE_ROUTE_NAMES: RouteName[] = ["tags.index", "feed", "questions.index", "articles.index", "subjects.index"]

export default function Nav() {
    const { t } = useLaravelReactI18n()
    const { auth: { user } } = usePage().props
    const { q } = route().params
    const { data, setData, get } = useForm({
        q
    })
    const results = usePage().props.results
    const [shouldShowSearchResult, setShouldShowSearchResult] = useState(false)
    const searchAction = SEARCHABLE_ROUTE_NAMES.includes(route().current() as string)
        ? route(route().current() as string)
        : false

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault()
        searchAction && get(searchAction)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setData("q", e.target.value)
        if (!(e.target.value.trim().length >= 3)) return;
        setShouldShowSearchResult(!!e.target.value.trim())
        x(e.target.value)
    }
    const searchFormRef = useRef<null | HTMLFormElement>(null)

    const x = useCallback(
        debounce((querySearchValue: string) => {
            router.visit(
                route(
                    route().current() as string,
                    { ...route().params, _query: { ...route().queryParams, q: querySearchValue } }
                ), {
                only: ["results"],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            })
        }, 500), [])

    const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        if (searchFormRef.current && searchFormRef.current.contains(e.relatedTarget)) {
            return;
        }
        setShouldShowSearchResult(false);
    };

    const [isDarkTheme, setDarkTheme] = useLocalStorageState("darkTheme", { defaultValue: false })

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkTheme)
    }, [isDarkTheme])


    return (
        <nav className="sticky z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur top-0">
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
                        <form
                            onFocus={
                                () => setShouldShowSearchResult(!!data.q)
                            }
                            ref={searchFormRef}
                            onBlur={handleBlur}
                            onSubmit={handleSearchSubmit}
                            className='w-full max-w-sm relative'
                        >
                            <Input
                                onChange={handleSearchChange}
                                value={data.q}
                                className='w-full'
                                type="search"
                                placeholder={t("content.looking_for") as string}
                            />
                            {
                                shouldShowSearchResult && <SearchResult results={results} />
                            }
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
                                                className="rounded-full text-secondary hover:text-current"
                                            >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Create new Post</span>
                                                <Plus />
                                            </button>
                                        </MenuButton>
                                        <CreatePostItems />
                                    </Menu>
                                    <Menu as="div" className="relative">
                                        <MenuButton className="flex rounded-full text-sm">
                                            <button
                                                type="button"
                                                className="rounded-full text-secondary hover:text-current"
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
                                            className="
                flex flex-col gap-1 p-1 py-2 mt-2 z-10 bg-surface-light dark:bg-surface-dark
                sm:absolute w-screen left-0 sm:left-auto fixed right-0 sm:max-w-64 rounded-md shadow-lg
            "
                                        >
                                            <MenuItem>
                                                <Link
                                                    href={route("profile.index")}
                                                    className="flex gap-4  px-4 py-2 text-sm rounded"
                                                >
                                                    <img src={avatar(user.avatar)} className="rounded-full size-12" />
                                                    <div className=''>
                                                        <div className='font-semibold'>{user.fullname}</div>
                                                        <div className='text-secondary text-xs'>{user.username}</div>
                                                    </div>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <button
                                                    onClick={(e) => {e.preventDefault(); setDarkTheme(!isDarkTheme)}}
                                                    className="flex gap-2 items-center text-start hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                                                >
                                                    <DarkMode size={20} />
                                                    {t("content.dark_mode")}
                                                    <Switch checked={isDarkTheme} className='ms-auto bg-secondary pointer-events-none' />
                                                </button>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    href={route("logout")}
                                                    method='post'
                                                    className="flex gap-2 items-center hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                                                >
                                                    <Logout size={20} />
                                                    {t("content.logout")}
                                                </Link>
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


type CreatePostLink = {
    header: string
    paragraph: string
    icon: ReactNode
    href: string
}

const CreatePostItems = () => {
    const { t } = useLaravelReactI18n()
    const createPostsLinks: CreatePostLink[] = [
        {
            header: t("content.ask") as string,
            href: route("questions.create"),
            paragraph: t("content.ask_paragraph") as string,
            icon: <QuestionMark />
        },
        {
            header: t("content.write") as string,
            href: route("articles.create"),
            paragraph: t("content.write_paragraph") as string,
            icon: <Pencil />
        },
        {
            header: t("content.discuss") as string,
            href: route("subjects.create"),
            paragraph: t("content.discuss_paragraph") as string,
            icon: <Discuss />
        },
    ]

    return <MenuItems
        className="
                flex flex-col gap-1 p-1 mt-4 z-10 bg-surface-light dark:bg-surface-dark
                sm:absolute w-screen left-0 sm:left-auto fixed right-0 sm:max-w-xs sm:mt-4 rounded-md shadow-lg
            "
    >
        {
            createPostsLinks.map(
                l => <MenuItem key={l.href}>
                    <Link
                        href={l.href}
                        className="grow p-2 hover:bg-background-light dark:hover:bg-background-dark rounded flex items-center gap-2 text-start"
                    >
                        <div className="basis-16 shrink-0 flex justify-center items-center">
                            {l.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold leading-loose">{l.header}</h3>
                            <p className="text-secondary text-xs tracking-tight leading-tight">{l.paragraph}</p>
                        </div>
                    </Link>
                </MenuItem>
            )
        }
    </MenuItems>
}



const SearchResult = ({ results }: { results?: Results }) => {
    const { t } = useLaravelReactI18n()
    const { user } = usePage().props.auth

    return !results
        ? null
        : <ul
            className="
                flex flex-col w-full gap-1 mt-3 pb-12 sm:pb-2 left-0 sm:left-auto
                fixed z-10 h-[calc(100vh-100%)] sm:max-h-96
                overflow-y-auto bg-surface-light dark:bg-surface-dark
                sm:absolute sm:rounded-md sm:shadow-lg
            "
        >
            {
                !!results.questions.count &&
                <li>
                    <div className='text-xs p-1 px-2 text-secondary flex justify-between items-center sticky inset-0 bg-surface-light dark:bg-surface-dark'>
                        <span className="">
                            {t("content.questions")}
                        </span>
                        {
                            <Link
                                href={route("questions.index", { _query: { q: results.q } })}
                                className='text-xs text-primary'
                            >
                                {t("content.view_all")}
                            </Link>
                        }
                    </div>
                    <ul className="flex gap-1 flex-col px-2 mt-2">
                        {
                            results.questions.items.map(
                                q => <li key={q.id}>
                                    <ResultItem
                                        href={route("questions.show", { post: q.slug })}
                                        htmlTitle={
                                            q.title
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold text-primary">${results.q}</span>`
                                                )
                                        }
                                        htmlDesc={
                                            q.content
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold">${results.q}</span>`
                                                )
                                        }
                                        sideElement={
                                            <div className="basis-8 mt-2">
                                                <Questions />
                                            </div>
                                        } />

                                </li>
                            )
                        }
                    </ul>
                </li>
            }
            {
                !!results.subjects.count &&
                <li>
                    <div className='text-xs p-1 px-2 text-secondary flex justify-between items-center sticky inset-0 bg-surface-light dark:bg-surface-dark'>
                        <span className="">
                            {t("content.subjects")}
                        </span>
                        {
                            <Link
                                href={route("subjects.index", { _query: { q: results.q } })}
                                className='text-xs text-primary'
                            >
                                {t("content.view_all")}
                            </Link>
                        }
                    </div>
                    <ul className="flex gap-1 flex-col px-2 mt-2">
                        {
                            results.subjects.items.map(
                                q => <li key={q.id}>
                                    <ResultItem
                                        href={route("subjects.show", { post: q.slug })}
                                        htmlTitle={
                                            q.title
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold text-primary">${results.q}</span>`
                                                )
                                        }
                                        htmlDesc={
                                            q.content
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold">${results.q}</span>`
                                                )
                                        }
                                        sideElement={
                                            <div className="basis-8 mt-2">
                                                <Subjects />
                                            </div>
                                        }
                                    />
                                </li>
                            )
                        }
                    </ul>
                </li>
            }
            {
                !!results.articles.count &&
                <li>
                    <div className='text-xs p-1 px-2 text-secondary flex justify-between items-center sticky inset-0 bg-surface-light dark:bg-surface-dark'>
                        <span className="">
                            {t("content.articles")}
                        </span>
                        {
                            <Link
                                href={route("articles.index", { _query: { q: results.q } })}
                                className='text-xs text-primary'
                            >
                                {t("content.view_all")}
                            </Link>
                        }
                    </div>
                    <ul className="flex gap-1 flex-col px-2 mt-2">
                        {
                            results.articles.items.map(
                                q => <li key={q.id}>
                                    <ResultItem
                                        href={route("articles.show", { post: q.slug })}
                                        htmlTitle={
                                            q.title
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold text-primary">${results.q}</span>`
                                                )
                                        }
                                        htmlDesc={
                                            q.content
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold">${results.q}</span>`
                                                )
                                        }
                                        sideElement={
                                            <div className="basis-8 mt-2">
                                                <Articles />
                                            </div>
                                        }
                                    />
                                </li>
                            )
                        }
                    </ul>
                </li>
            }
            {
                !!results.users.count &&
                <li>
                    <div className='text-xs p-1 px-2 text-secondary flex justify-between items-center sticky inset-0 bg-surface-light dark:bg-surface-dark'>
                        <span className="">
                            {t("content.users")}
                        </span>
                    </div>
                    <ul className="flex gap-1 flex-col px-2 mt-2">
                        {
                            results.users.items.map(
                                u => <li key={u.id}>
                                    <ResultItem
                                        href={route("profile.show", { user: u.username })}
                                        htmlTitle={
                                            u.fullname
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold text-primary">${results.q}</span>`
                                                )
                                            + (user?.id === u.id ? ` <span class="font-bold text-xs">(${t("common.you")})</span>` : "")
                                        }
                                        htmlDesc={
                                            u.username
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold">${results.q}</span>`
                                                )
                                        }
                                        sideElement={
                                            <img src={avatar(u.avatar)} className="size-8 rounded-full" />
                                        }
                                    />

                                </li>
                            )
                        }
                    </ul>
                </li>
            }
            {
                !!results.tags.count &&
                <li>
                    <div className='text-xs p-1 px-2 text-secondary flex justify-between items-center sticky inset-0 bg-surface-light dark:bg-surface-dark'>
                        <span className="">
                            {t("content.tags")}
                        </span>
                        {
                            <Link
                                href={route("tags.index", { _query: { q: results.q } })}
                                className='text-xs text-primary'
                            >
                                {t("content.view_all")}
                            </Link>
                        }
                    </div>
                    <ul className="flex gap-1 flex-col px-2 mt-2">
                        {
                            results.tags.items.map(
                                t => <li key={t.id}>
                                    <ResultItem
                                        href={route("feed", { _query: { included_tags: [t.name] } })}
                                        htmlTitle={
                                            t.name
                                                .replace(
                                                    new RegExp(results.q, "gi"),
                                                    `<span class="font-bold text-primary">${results.q}</span>`
                                                )
                                        }
                                        sideElement={<Tags />}
                                    />

                                </li>
                            )
                        }
                    </ul>
                </li>
            }
            {
                !!(
                    results.questions.count === 0
                    && results.articles.count === 0
                    && results.subjects.count === 0
                    && results.users.count === 0
                    && results.tags.count === 0
                ) && <li className='size-full flex justify-center items-center'><NothingFound /></li>
            }
        </ul>
}

interface ResultItemProps {
    href: string;
    sideElement: ReactNode;
    htmlTitle: string;
    htmlDesc?: string;
}

const ResultItem = ({ sideElement, href, htmlTitle, htmlDesc }: ResultItemProps) => {
    return <div className='rounded p-1 px-2 hover:bg-background-light/75 dark:hover:bg-background-dark/75'>
        <Link
            className='flex gap-4'
            href={href}
        >
            {sideElement}
            <div className="flex flex-col">
                <h3
                    dangerouslySetInnerHTML={{ __html: htmlTitle }}
                />
                {
                    htmlDesc &&
                    <p className='text-secondary text-xs'
                        dangerouslySetInnerHTML={{ __html: htmlDesc }}
                    />
                }

            </div>
        </Link>
    </div>
}

const NothingFound = () => {
    const { t } = useLaravelReactI18n()
    return <div className="flex justify-center items-center flex-col gap-4 text-secondary">
        <Search size={48} />
        <h2>{t("content.nothing_found")}</h2>
    </div>
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
