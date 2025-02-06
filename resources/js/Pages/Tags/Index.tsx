import Articles from "@/Components/icons/Articles";
import Questions from "@/Components/icons/Questions";
import Subjects from "@/Components/icons/Subjects";
import Tag from "@/Components/ui/Tag";
import { Link, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormattedNumber } from "react-intl";
import type { TagWithCounts } from "@/types/tag";
import { useState } from "react";
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import Tags from "@/Components/icons/Tags";

export default function TagsIndex() {
    const { t } = useLaravelReactI18n()
    const { tags: { next_link_url, items: initialTags, count } } = usePage().props
    const [tags, setTags] = useState(initialTags);
    const { q } = route().queryParams

    return <Layout>
        <div className="flex flex-col gap-8 mb-12">
            <div className="mt-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-display leading-loose tracking-wider">{t("content.tags")}</h1>
                    <span className="text-secondary">{count} {t("content.tags")}</span>
                </div>
                <p className="text-secondary">
                    {t("tags.tag_definition")}
                </p>
                {
                    !!q && <p className="text-secondary mt-4">
                        {t("content.results_of_query", {
                            q: <span className="">"{q}":</span>
                        })}
                    </p>
                }
            </div>
            {
                !tags.length
                    ? <NoTagFound />
                    : <>
                        <div className="grid sm:grid-cols-2 gap-4 justify-items-center lg:grid-cols-3 xl:grid-cols-4">
                            {
                                tags.map(t => <TagItem key={t.id} {...t} />)
                            }
                        </div>
                        {
                            next_link_url
                            && <InfiniteScrollLoader
                                className="text-secondary text-center"
                                url={next_link_url}
                                onSuccess={props => setTags(tags => [...tags, ...props.tags.items])}
                            >
                                {t("content.loading_more")}
                            </InfiniteScrollLoader>
                        }
                    </>
            }
        </div>
    </Layout >
}


export const TagItem = ({ name, posts_count, articles_count, subjects_count, questions_count }: TagWithCounts) => {
    const { t, tChoice } = useLaravelReactI18n()

    return <div className="group py-4 px-2.5 border border-secondary/25 hover:border-secondary/75 rounded flex flex-col gap-8 w-full max-w-xs">
        <div className="text-xs flex gap-2 items-center justify-between">
            <Link
                href={route("feed", {
                    _query: {
                        tags: [name]
                    }
                }
                )
                }
            >
                <Tag>
                    {name}
                </Tag>
            </Link>

            <span className="text-secondary group-hover:text-current">
                {
                    tChoice("tags.usage", posts_count, {
                        count: <FormattedNumber value={posts_count} style="decimal" notation="compact" />
                    })
                }
            </span>
        </div>
        <div className="text-xs mt-4 grid gap-1 grid-cols-3">

            <Link
                href={
                    route("questions.index", {
                        _query: {
                            tags: [name]
                        }

                    }
                    )
                }
                className="flex flex-col gap-2 items-center border-r border-secondary/25 px-1 py-1 hover:text-secondary">
                <div className="flex flex-col gap-0.5 items-center ">
                    <Questions />
                    <span className="text-2xs">
                        {t("content.question")}
                    </span>
                </div>
                {" "}
                <FormattedNumber value={questions_count} style="decimal" notation="compact" />
            </Link>
            <Link
                href={
                    route("subjects.index", {
                        _query: {
                            tags: [name]
                        }

                    }
                    )
                }
                className="flex flex-col gap-2 items-center border-r border-secondary/25 px-1 py-1 hover:text-secondary"
            >
                <div className="flex flex-col gap-0.5 items-center">
                    <Subjects />
                    <span className="text-2xs">
                        {t("content.subject")}
                    </span>
                </div>
                {" "}
                <FormattedNumber value={subjects_count} style="decimal" notation="compact" />
            </Link>
            <Link
                href={
                    route("articles.index", {
                        _query: {
                            tags: [name]
                        }

                    }
                    )
                }
                className="flex flex-col gap-2 items-center px-1 py-1 hover:text-secondary">
                <div className="flex flex-col gap-0.5 items-center">
                    <Articles />
                    <span className="text-2xs">
                        {t("content.article")}
                    </span>
                </div>
                {" "}
                <FormattedNumber value={articles_count} style="decimal" notation="compact" />
            </Link>
        </div>
    </div>
}


export const NoTagFound = () => {
    const { t } = useLaravelReactI18n()

    return <div className="h-96 flex text-secondary justify-center items-center flex-col gap-4 text-2xl">
        <Tags size={48} />
        {t("tags.not_tag_found")}
    </div>
}
