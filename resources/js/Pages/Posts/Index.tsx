import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react"
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import Layout from "@/Layouts/Layout";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Post } from "@/types/post";
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat";
import Tag from "@/Components/ui/Tag";
import clsx from "clsx";
import UpVote from "@/Components/icons/UpVote";
import DownVote from "@/Components/icons/DownVote";
import Comments from "@/Components/icons/Comments";
import Views from "@/Components/icons/Views";
import { FormattedNumber } from "react-intl";
import { avatar } from "@/Utils/helpers/path"
import Check from "@/Components/icons/Check";
import Filter from "@/Layouts/Components/Filter";
import FilterIcon from "@/Components/icons/Filter"
import { useState } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import Search from "@/Components/icons/Search";

export default function PostsIndex() {
    const { t, tChoice } = useLaravelReactI18n()
    const { posts: { items: posts, next_page_url, count } } = usePage().props;
    const { q } = route().queryParams
    const postType = route().current("articles.*")
        ? t("content.articles")
        : route().current("questions.*")
            ? t("content.questions")
            : route().current("subjects.*")
                ? t("content.subjects")
                : t("content.posts")
    const subheading = route().current("articles.*")
        ? t("posts.articles_subheading")
        : route().current("questions.*")
            ? t("posts.questions_subheading")
            : route().current("subjects.*")
                ? t("posts.subjects_subheading")
                : t("posts.posts_subheading")
    const [showFilter, setShowFilter] = useState(false)
    const shouldShowFilter = useMediaQuery("(min-width: 1024px)") || showFilter

    return <Layout>
        <div className="flex flex-col gap-8 mb-12">
            <div className="mt-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-display leading-loose tracking-wider">{postType}</h1>
                    <span className="text-secondary">{tChoice("posts.count", count, {
                        type: postType
                    })}</span>
                </div>
                <p className="text-secondary text-sm">
                    {subheading}
                </p>
                {
                    !!q && <p className="text-secondary mt-4">
                        {t("content.results_of_query", {
                            q: <span className="">"{q as string}":</span>
                        })}
                    </p>
                }
            </div>
            <div className="flex flex-col-reverse lg:flex-row gap-8">
                <div className="w-full">
                    {
                        posts.length
                            ?
                            <div className="flex flex-col gap-4">
                                {
                                    posts.map(p => <PostItem key={p.id} {...p} />)
                                }
                            </div>
                            : <div className="flex justify-center items-center size-full">
                                <NothingFound />
                            </div>
                    }
                    {
                        next_page_url &&
                        <InfiniteScrollLoader
                            url={next_page_url}
                            className="text-secondary text-center"
                        >
                            {t("content.loading_more")}
                        </InfiniteScrollLoader>
                    }
                </div>
                {
                    shouldShowFilter && <Filter />
                }
                <div className="flex justify-end lg:hidden">
                    <button
                        className="flex items-center font-bold text-sm gap-2.5 text-secondary hover:text-current"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        {t("content.filter")} <FilterIcon />
                    </button>
                </div>
            </div>
        </div>
    </Layout>
}


const PostItem = (p: Post) => {
    const { t } = useLaravelReactI18n()
    const formatDate = useRelativeDateFormat()
    const { user } = usePage().props.auth
    const routeName = p.type.toLowerCase() + "s.show"

    return <div id={`post-${p.id}`} className="max-w-4xl w-full flex flex-col-reverse sm:flex-row gap-8 border border-secondary/25 hover:border-secondary/75 rounded p-4 mx-auto" key={p.id}>
        <div className="sm:basis-24 justify-between items-center shrink-0 flex sm:flex-col sm:justify-center sm:items-end gap-2">
            <div className="flex sm:flex-col gap-2 sm:mb-4">
                <Link
                    href={route("posts.vote", {
                        votable: p.slug
                    })}
                    method={p.user_vote === "UP" ? "delete" : "post"}
                    data={{
                        type: "UP"
                    }}
                    only={["posts", "next_page_url", "auth"]}
                    preserveScroll
                    preserveState={false}
                    className={
                        clsx(
                            "font-semibold rounded-full p-2.5 flex text-xs gap-2",
                            p.user_vote === "UP"
                                ? "bg-success-light/25 dark:bg-success-dark/25 text-success-light dark:text-success-dark"
                                : "bg-secondary/10 hover:bg-secondary/25"
                        )
                    }
                >
                    <UpVote size={16} />
                    <span>
                        <FormattedNumber value={p.up_votes_count} style="decimal" notation="compact" />
                    </span>
                </Link>
                <Link
                    href={route("posts.vote", {
                        votable: p.slug
                    })}
                    method={p.user_vote === "DOWN" ? "delete" : "post"}
                    data={{
                        type: "DOWN"
                    }}
                    only={["posts", "next_page_url", "auth"]}
                    preserveScroll
                    preserveState={false}
                    className={
                        clsx(
                            "font-semibold rounded-full p-2.5 flex items-center text-xs gap-2",
                            p.user_vote === "DOWN"
                                ? "bg-error-light/25 dark:bg-error-dark/25 text-error-light dark:text-error-dark"
                                : "bg-secondary/10 hover:bg-secondary/25"
                        )
                    }
                >
                    <DownVote size={16} />
                    <span>
                        <FormattedNumber value={p.down_votes_count} style="decimal" notation="compact" />
                    </span>
                </Link>
            </div>
            <div className="text-2xs flex sm:flex-col gap-4 sm:gap-0 items-center sm:items-end">
                {
                    p.answer_exists &&
                    <Link href={route(routeName, { post: p.slug }) + "#answer"} className="px-1 font-semibold py-0.5 rounded sm:bg-success-light/25 dark:sm:bg-success-dark/25 text-success-light dark:text-success-dark italic flex gap-1 items-center">
                        <Check size={16} />
                        <span className="hidden sm:block">
                            {t("content.answered")}
                        </span>
                    </Link>
                }
                {
                    route().current("feed") && <span className="italic text-secondary flex gap-1 items-center">
                        {t(`content.${p.type.toLowerCase()}`)}
                    </span>
                }
                <span className="text-secondary flex gap-1 items-center">
                    <FormattedNumber value={p.comments_count} style="decimal" notation="compact" />
                    <span className="hidden sm:block">{t("content.comments")}</span>
                    <span className="sm:hidden">
                        <Comments size={16} />
                    </span>
                </span>
                <span className="text-secondary flex gap-1 items-center">
                    <FormattedNumber value={p.views} style="decimal" notation="compact" />
                    <span className="hidden sm:block">{t("content.views")}</span>
                    <span className="sm:hidden">
                        <Views size={16} />
                    </span>
                </span>
            </div>
        </div>
        <div className="grow flex flex-col gap-2.5">
            <Link
                href={route(routeName, { post: p.slug })}
                className="font-semibold text-lg"
            >
                {p.title}
            </Link>
            <p className="text-sm line-clamp-4 sm:line-clamp-3 prose-p:inline break-all" dangerouslySetInnerHTML={{ __html: p.content }} />
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 text-xs items-center justify-end">
                    <Link
                        href={p.user ? route("profile.show", { user: p.user.username }) : ""}
                        className="flex gap-1 items-center font-bold"
                    >
                        <img className="size-4 rounded-full" src={avatar(p.user?.avatar)} alt={p.user?.fullname} />
                        {
                            p.user_id === user?.id
                                ? t("common.you")
                                : p.user?.username ?? t("content.someone")
                        }
                    </Link>
                    <span className="italic text-secondary flex gap-1 items-center">
                        {formatDate(p.created_at)}
                    </span>
                </div>
                <div className="flex gap-1 sm:justify-end flex-wrap">
                    {p.tags.map(t => <Link key={t.id} href={route("feed", { _query: { included_tags: [t.name] } })}><Tag {...t} >{t.name}</Tag></Link>)}
                </div>
            </div>
        </div>
    </div >
}

export const NothingFound = () => {
    const { t } = useLaravelReactI18n()

    return <div className="flex text-secondary justify-center items-center flex-col gap-4 text-2xl">
        <Search size={48} />
        {t("content.nothing_found")}
    </div>
}
