import Articles from "@/Components/icons/Articles";
import clsx from "clsx"
import Questions from "@/Components/icons/Questions";
import Subjects from "@/Components/icons/Subjects";
import Trash from "@/Components/icons/Trash"
import Pencil from "@/Components/icons/Pencil"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"
import Textarea from "@/Components/ui/Textarea"
import ConfirmDeleteCtx from "@/Contexts/ConfirmDeleteCtx";
import Tag from "@/Components/ui/Tag";
import { Link, usePage, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormattedNumber } from "react-intl";
import type { TagWithCounts } from "@/types/tag";
import { useState, useContext, FormEvent, } from "react";
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
                <p className="text-secondary text-sm">
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


export const TagItem = ({ id, name, description, posts_count, articles_count, subjects_count, questions_count }: TagWithCounts) => {
    const { t, tChoice } = useLaravelReactI18n()
    const { auth: { user } } = usePage().props
    const { data, setData, put, errors } = useForm({
        name,
        description,
    })
    const { setAction } = useContext(ConfirmDeleteCtx)
    const handleSubmit = (e: FormEvent) => {
        put(route("tags.update", { tag: id }), {
            onSuccess: () => setEditable(false),
            preserveState: "errors"
        })
        e.preventDefault()
    }
    const [editable, setEditable] = useState(false)

    return <form className="group py-4 px-2.5 border border-secondary/25 hover:border-secondary/75 rounded flex flex-col gap-4 justify-between w-full max-w-xs relative">

        {

            user.role != "USER" && <div className="hidden group-hover:flex gap-4 absolute -top-2 end-2">
                {
                    !editable && <button
                        type="button"
                        onClick={() => setAction(route("tags.destroy", { tag: id }))}
                        className="bg-background-light px-0.5 dark:bg-background-dark text-secondary hover:text-error-light dark:hover:text-error-dark"
                    >
                        <Trash size={16} />
                    </button>
                }
                <button
                    className={
                        clsx(
                            "bg-background-light px-0.5 dark:bg-background-dark text-current text-xs flex gap-1 items-center",
                            !editable ? "text-secondary " : "-translate-y-1 py-1 px-2 rounded bg-secondary/25",
                        )
                    }
                    type={"button"}
                    onClick={
                        (e) => {
                            if (editable) return handleSubmit(e)
                            setEditable(!editable)
                        }
                    }
                >
                    {editable ? t('content.save') : <Pencil size={16} />}
                </button>
            </div>
        }
        <div className="flex flex-col gap-4">
            <div className="text-xs flex gap-2 items-center justify-between">
                {

                    editable
                        ? <Input className="w-full font-bold" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                        : <>
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
                        </>
                }
                <Error>
                    {errors.name}
                </Error>
            </div>
            {
                editable
                    ? <Textarea value={data.description} onChange={(e) => setData("description", e.target.value)} className="bg-transparent h-48" />
                    : <p className="text-sm text-secondary group-hover:text-current break-all">{description}</p>
            }
            <Error>
                {errors.description}
            </Error>
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
    </form>
}


export const NoTagFound = () => {
    const { t } = useLaravelReactI18n()

    return <div className="h-96 flex text-secondary justify-center items-center flex-col gap-4 text-2xl">
        <Tags size={48} />
        {t("tags.not_tag_found")}
    </div>
}
