import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import { Link, router, usePage } from "@inertiajs/react"
import { Mission } from "@/types/mission"
import { avatar, mission_image } from "@/Utils/helpers/path"
import { Duration } from "luxon"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import UpVote from "@/Components/icons/UpVote";
import DownVote from "@/Components/icons/DownVote";
import { FormattedNumber } from "react-intl";
import { ARTICLE, QUESTION, SUBJECT } from "@/Enums/PostType"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import Tag from "@/Components/ui/Tag"
import Questions from "@/Components/icons/Questions"
import Articles from "@/Components/icons/Articles"
import Subjects from "@/Components/icons/Subjects"
import Views from "@/Components/icons/Views"
import Check from "@/Components/icons/Check"
import Editor from "@/Components/ui/Editor"
import Layout from "@/Layouts/Layout"
import { useContext } from "react"
import ReportActionCtx from "@/Contexts/ReportActionCtx"
import Flag from "@/Components/icons/Flag"
import Trash from "@/Components/icons/Trash"
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx"
import Prohibited from "@/Components/icons/Prohibited"
import Refresh from "@/Components/icons/Refresh"

export default function ProfileMe() {
    const { user, auth } = usePage().props
    const fixedFormat = useFixedDateFormat()
    const percentToNextLevel = user.stats.xp.percent_to_next_level * 100
    const d = Duration.fromMillis(user.stats.timespent * 1000).shiftTo("hours", "minutes", "seconds", "days")
    const { t } = useLaravelReactI18n()
    const { setReportAction } = useContext(ReportActionCtx)
    const { setAction: setConfirmDeleteAction } = useContext(ConfirmDeleteCtx)
    const formattedTimespent = `
        ${d.days && Math.floor(d.days).toString().concat(t("content.d") as string) || ""}
        ${d.hours && Math.floor(d.hours).toString().concat(t("content.h") as string) || ""}
        ${d.minutes && Math.floor(d.minutes).toString().concat(t("content.m") as string) || ""}
        ${d.seconds && Math.floor(d.seconds).toString().concat(t("content.s") as string) || ""}
    `;
    const posts = [
        {
            icon: <Questions size={16} />,
            name: t("content.questions"),
            posts: user.posts.filter(p => p.type === QUESTION)
        },
        {
            icon: <Articles size={16} />,
            name: t("content.articles"),
            posts: user.posts.filter(p => p.type === ARTICLE)
        },
        {
            icon: <Subjects size={16} />,
            name: t("content.subjects"),
            posts: user.posts.filter(p => p.type === SUBJECT)
        },
    ]

    const formatRelatively = useRelativeDateFormat()

    return <Layout>
        <div className="flex gap-8 md:flex-row flex-col">
            <div className="flex gap-4  flex-col items-center md:items-start text-center md:text-start md:flex-row">
                <img src={avatar(user.avatar)} className="size-32 rounded-lg" />

                <div className="flex flex-col">
                    <div className="text-xl font-bold">{user.fullname}</div>
                    <span className="text-xs text-secondary font-bold">
                        {user.username}
                    </span>
                    <span className="text-xs text-secondary">
                        <span className="">

                            {t("content.member_since", { date: fixedFormat(user.created_at) })}
                        </span>
                    </span>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">
                            {user.stats.level}
                        </span>
                        <div className="rounded-full w-32 h-2 bg-secondary/25 relative overflow-hidden">
                            <span className="bg-success-light dark:bg-success-dark absolute inset-0 rounded" style={{ width: `${percentToNextLevel}%` }}></span>
                        </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                        {
                            user.deleted_at
                                ? <Link
                                    method="delete"
                                    href={route("profile.unban", { user: user.username })}
                                    preserveState="errors"
                                    className="flex gap-1 font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-xs"
                                >
                                    {t("content.unban")}
                                    <Refresh size={12} />
                                </Link>

                                : <>
                                    <Link
                                        method="post"
                                        href={route("profile.ban", { user: user.username })}
                                        preserveState="errors"
                                        className="flex gap-1 font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-xs text-error-light dark:text-error-dark"
                                    >
                                        {t("content.ban")}
                                        <Prohibited size={12} />
                                    </Link>
                                    <span className="text-secondary/50">|</span>
                                </>
                        }
                        {
                            !user.deleted_at && <button
                                onClick={
                                    () => !!auth.user
                                        ? setReportAction(route("profile.report", { reportable: user.username }))
                                        : router.visit(route("login"))
                                }
                                className="flex gap-1 font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-error-light dark:text-error-dark text-xs"
                            >
                                {t("content.report")}
                                <Flag size={12} />
                            </button>
                        }
                        {

                            (auth.user.role == "SUPER_ADMIN" || auth.user.role == "ADMIN") &&
                            <>
                                <span className="text-secondary/50">|</span>
                                <button
                                    onClick={
                                        () => !!auth.user
                                            ? setConfirmDeleteAction(route("users.delete", { user: user.username }))
                                            : router.visit(route("login"))
                                    }
                                    className="flex gap-1 font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-error-light dark:text-error-dark text-xs"
                                >
                                    {t("content.delete")}
                                    <Trash size={12} />
                                </button>
                            </>
                        }
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-64 mx-auto lg:mx-0 lg:ms-auto rounded-lg border-secondary/25 border-2 p-4">
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.global_rank")}</span> {user.stats.rank.total}</div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.timespent")}</span> <span className="italic">{formattedTimespent}</span></div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.current_streak")}</span> {user.stats.login.streak}</div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.max_streak")}</span> {user.stats.login.max_streak}</div>
            </div>

        </div>

        {
            !!user.bio // not null
            && (user.bio !== "<p></p>") // not empty
            && <Editor className="mt-4" readOnly defaultValue={user.bio} />
        }
        <div className="mt-12">
            <div>
                <section className="my-8">
                    <h2 className="font-bold text-2xl mb-8">{t("content.achievements")}</h2>
                    <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-24">
                        {
                            user.missions.map(m =>
                                <li key={m.id} className="basis-48">
                                    <AchievementItem mission={m} />
                                </li>
                            )
                        }
                    </ul>
                </section>
            </div>
        </div>
        <div className="mt-12 flex flex-col lg:flex-row gap-12">
            <section className=" shrink-0">
                <h2 className="font-bold text-2xl mb-8">
                    {
                        t("content.statistics")
                    }
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl">
                        <div className="flex gap-4 items-center justify-between">
                            <div className="max-w-48">
                                <h3 className="font-bold">{t("stats.total_votes")}</h3>
                                <p className="text-secondary text-xs">{t("stats.total_votes_desc")}</p>
                            </div>
                            <div className="flex gap-2 font-bold text-lg">

                                <span className="text flex gap-1 items-center text-success-light dark:text-success-dark">
                                    <FormattedNumber value={user.totalReceivedUpVotes} style="decimal" notation="compact" />
                                    <UpVote />
                                </span>
                                <span className="text flex gap-1 items-center text-error-light dark:text-error-dark">
                                    <FormattedNumber value={user.totalReceivedDownVotes} style="decimal" notation="compact" />
                                    <DownVote />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl">
                        <div className="flex gap-4 items-center justify-between">
                            <div className="max-w-48">
                                <h3 className="font-bold">{t("stats.total_views")}</h3>
                                <p className="text-secondary text-xs">{t("stats.total_views_desc")}</p>
                            </div>

                            <span className="flex gap-1 items-center font-bold text-lg">
                                <FormattedNumber value={user.totalReceivedViews} style="decimal" notation="compact" />
                                <Views />
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl">
                        <div className="flex gap-4 items-center justify-between">
                            <div className="max-w-48">
                                <h3 className="font-bold">{t("stats.total_answers")}</h3>
                                <p className="text-secondary text-xs">{t("stats.total_answers_desc")}</p>
                            </div>

                            <span className="flex gap-1 items-center font-bold text-success-light dark:text-success-dark text-lg">
                                <FormattedNumber value={user.answers_count} style="decimal" notation="compact" />
                                <Check />
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grow">
                <h2 className="font-bold text-2xl mb-8">
                    {
                        t("posts.posts_you_published")
                    }
                </h2>
                <div className="">
                    <TabGroup>
                        <TabList className="flex flex-wrap gap-4">
                            {
                                posts.map(({ name, icon, posts }) => (
                                    <Tab
                                        key={name as string}
                                        className="flex gap-2 items-center rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-surface-light dark:data-[selected]:bg-surface-dark hover:bg-surface-light dark:hover:bg-surface-dark data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        {icon}
                                        <div>
                                            {name} <span className="text-secondary font-normal text-xs">
                                                <FormattedNumber value={posts.length} style="decimal" notation="compact" />

                                            </span>
                                        </div>
                                    </Tab>
                                ))
                            }
                        </TabList>
                        <TabPanels className="mt-3">
                            {posts.map(({ name, posts }) => (
                                <TabPanel key={name as string} className="rounded-xl bg-surface-light dark:bg-surface-dark p-3">
                                    <ul>
                                        {
                                            !posts.length && <li className="h-64 flex justify-center items-center text-secondary text-xl">
                                                {t("posts.nothing_here_yet")}
                                            </li>
                                        }
                                        {posts.map((post) => (
                                            <li key={post.id} className="relative rounded-md p-3 text-sm/6 hover:bg-background-light dark:hover:bg-background-dark">
                                                <Link
                                                    href={route(post.type.toLowerCase() + "s.show", { post: post.slug })}
                                                    className="font-semibold"
                                                >
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                    {post.up_votes_count}
                                                </Link>
                                                <div className="flex flex-wrap justify-between gap-1 mt-4">

                                                    <ul className="flex flex-wrap gap-1">
                                                        {
                                                            post.tags.map(t => <li key={t.id}><Tag>{t.name}</Tag></li>)
                                                        }
                                                    </ul>
                                                    <ul className="lowercase text-xs ms-auto flex gap-1 flex-wrap items-center justify-end text-secondary" aria-hidden="true">
                                                        <li className="text flex gap-1 items-center text-success-light dark:text-success-dark">
                                                            <FormattedNumber value={post.up_votes_count} style="decimal" notation="compact" />
                                                            <UpVote size={12} />
                                                        </li>
                                                        <li className="text flex gap-1 items-center text-error-light dark:text-error-dark">
                                                            <FormattedNumber value={post.down_votes_count} style="decimal" notation="compact" />
                                                            <DownVote size={12} />
                                                        </li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>
                                                            <FormattedNumber value={post.comments_count} style="decimal" notation="compact" /> {" "}
                                                            {t("content.comments")}
                                                        </li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{formatRelatively(post.created_at)}</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </TabGroup>
                </div>
            </section>
        </div>
    </Layout >
}


const AchievementItem = ({ mission: m }: { mission: Mission }) => {
    return <div className="flex flex-col gap-2 text-center">
        <img src={mission_image(m.image)} className="size-24 mx-auto" />
        <span className={`font-semibold text-xs`}>
            {m.title}
        </span>
    </div>
}
