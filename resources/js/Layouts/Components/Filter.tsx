import Input from "@/Components/ui/Input"
import { Link, useForm } from "@inertiajs/react"
import Tag from "@/Components/ui/Tag"
import {
    ANY,
    HAS_MARKED_ANSWER,
    NO_MARKED_ANSWER
} from "@/Enums/Filters"
import {
    MORE_TO_LESS_VIEWS,
    LESS_TO_MORE_VIEWS,
    LESS_TO_MORE_ACTIVITY,
    MORE_TO_LESS_ACTIVITY,
    NEW_TO_OLD,
    OLD_TO_NEW
} from "@/Enums/Sorts"
import { FormEvent } from "react";
import InputChips from "@/Components/ui/InputChips"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function Filter() {
    const { t } = useLaravelReactI18n()
    const {
        filter = ANY,
        sort = NEW_TO_OLD,
        included_tags = [],
        excluded_tags = []
    } = route().params
    const { get, setData, data } = useForm({
        filter,
        sort,
        included_tags: included_tags as string[],
        excluded_tags: excluded_tags as string[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        get(
            route(route().current() as string),
            {
                preserveScroll: true
            }
        )
    }

    return <div className="basis-64 shrink-0 grow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs mx-auto">
            <div className="flex flex-col gap-2 rounded border border-secondary/25 p-4">
                <h2 className="font-semibold">{t("content.filter")}</h2>
                <ul className="ms-4 text-sm">
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.any")}
                            <Input
                                type="radio"
                                name="filter"
                                onChange={() => setData("filter", ANY)}
                                checked={data.filter === ANY}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.answered")}
                            <Input
                                type="radio"
                                name="filter"
                                onChange={() => setData("filter", HAS_MARKED_ANSWER)}
                                checked={data.filter === HAS_MARKED_ANSWER}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.unanswered")}
                            <Input
                                type="radio"
                                name="filter"
                                onChange={() => setData("filter", NO_MARKED_ANSWER)}
                                checked={data.filter === NO_MARKED_ANSWER}
                            />
                        </label>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-2 rounded border border-secondary/25 p-4">
                <h2 className="font-semibold">{t("content.sort")}</h2>
                <ul className="ms-4 text-sm">
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.new_to_old")}
                            <Input
                                defaultChecked
                                type="radio"
                                name="sort"
                                value={NEW_TO_OLD}
                                onChange={() => setData("sort", NEW_TO_OLD)}
                                checked={data.sort === NEW_TO_OLD}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.old_to_new")}
                            <Input
                                type="radio"
                                name="sort"
                                onChange={() => setData("sort", OLD_TO_NEW)}
                                checked={data.sort === OLD_TO_NEW}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.more_activity_to_less")}
                            <Input
                                type="radio"
                                name="sort"
                                onChange={() => setData("sort", MORE_TO_LESS_ACTIVITY)}
                                checked={data.sort === MORE_TO_LESS_ACTIVITY}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.less_activity_to_more")}
                            <Input
                                type="radio"
                                name="sort"
                                onChange={() => setData("sort", LESS_TO_MORE_ACTIVITY)}
                                checked={data.sort === LESS_TO_MORE_ACTIVITY}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.more_views_to_less")}
                            <Input
                                type="radio"
                                name="sort"
                                onChange={() => setData("sort", MORE_TO_LESS_VIEWS)}
                                checked={data.sort === MORE_TO_LESS_VIEWS}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex gap-2 justify-between items-center">
                            {t("filter.less_to_more_view")}
                            <Input
                                type="radio"
                                name="sort"
                                onChange={() => setData("sort", LESS_TO_MORE_VIEWS)}
                                checked={data.sort === LESS_TO_MORE_VIEWS}
                            />
                        </label>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-2 rounded border border-secondary/25 p-4">
                <h2 className="font-semibold">{t("content.tags")}</h2>
                <ul className="ms-4 text-sm flex flex-col gap-8">
                    <li>
                        <label className="flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {t("filter.include")}: {" "}
                                {
                                    data.included_tags.map(
                                        t => <button
                                            onClick={
                                                () => setData("included_tags", [...data.included_tags.filter(i => i !== t)])}
                                        >
                                            <Tag>{t}</Tag>
                                        </button>
                                    )
                                }
                            </div>
                            <InputChips
                                className="w-full"
                                onChange={tags => setData("included_tags", tags)}
                                value={data.included_tags}
                            />
                        </label>
                    </li>
                    <li>
                        <label className="flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {t("filter.exclude")}: {" "}
                                {
                                    data.excluded_tags.map(
                                        t => <button
                                            onClick={
                                                () => setData("excluded_tags", [...data.excluded_tags.filter(i => i !== t)])
                                            }
                                        >
                                            <Tag>{t}</Tag>
                                        </button>
                                    )
                                }
                            </div>
                            <InputChips
                                className="w-full"
                                onChange={tags => setData("excluded_tags", tags)}
                                value={data.excluded_tags}
                            />
                        </label>
                    </li>
                </ul>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <button
                    type="submit"
                    className="p-2 px-4 bg-secondary/25 rounded-md border hover:bg-secondary/50"
                >
                    Apply
                </button>
                <Link
                    href={route(route().current() as string)}
                    as="button"
                    className="p-2 px-4 rounded border border-transparent"
                    preserveScroll
                >
                    Reset
                </Link>
            </div>
        </form>
    </div>
}
