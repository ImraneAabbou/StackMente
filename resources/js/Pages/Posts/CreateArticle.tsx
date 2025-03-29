import { useForm } from "@inertiajs/react"
import { FormEvent, useRef } from "react"
import {
    ARTICLE,
} from "@/Enums/PostType"
import Editor from "@/Components/ui/Editor"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"
import { Description, Field, Label } from "@headlessui/react"
import Layout from "@/Layouts/Layout"
import { useLaravelReactI18n } from "laravel-react-i18n"
import Quill from "quill"
import InputChips from "@/Components/ui/InputChips"
import Tag from "@/Components/ui/Tag"
import { Tag as TagType } from "@/types/tag"
import CreateTagsModal from "@/Components/modals/CreateTagsModal"

export default function PostsCreate() {
    const { t } = useLaravelReactI18n()
    const editorRef = useRef<Quill | null>(null)
    const { errors, data, setData, post, reset, setError } = useForm("CreateArticle", {
        title: "",
        tags: [] as Omit<TagType, "created_at" | "id">[],
        type: ARTICLE,
        content: "",
    })
    const errorTags = errors.tags as string[] | string | undefined
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post("/posts", {
            onSuccess: () => reset()
        })
    }

    return <Layout>
        {
            typeof errorTags !== "string" &&
            <CreateTagsModal setTags={(tags) => setData("tags", tags)} tags={data.tags} errors={errors} errorTags={errorTags} onClose={() => setError("tags", "")} />
        }
        <div className="flex flex-col gap-8 my-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <Field className="flex lg:items-center flex-col lg:flex-row gap-4 justify-between max-w-3xl">
                    <div>
                        <Label className="font-bold">{t("content.title")}</Label>
                        <Description className="text-sm text-secondary">{t("posts.article_title_description")}</Description>
                        <Error>{typeof errors.tags == "string" ? errors.tags : ""}</Error>
                    </div>
                    <Input
                        className="w-full max-w-sm"
                        type="text"
                        onChange={(e) => setData("title", e.target.value)} value={data.title}
                    />
                </Field>
                <div>
                    <Field className="flex lg:items-center flex-col lg:flex-row gap-4 justify-between max-w-3xl">
                        <div>
                            <Label className="font-bold">{t("content.tags")}</Label>
                            <Description className="text-sm text-secondary">{t("posts.article_tags_description")}</Description>
                            <Error>{errors.tags}</Error>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <InputChips
                                maxLength={6}
                                className="w-full max-w-sm bg-surface-light dark:bg-surface-dark"
                                type="text"
                                onChange={
                                    (chips) => setData(
                                        'tags',
                                        chips.length
                                            ? [...data.tags, { name: chips[chips.length - 1], description: "" }]
                                            : []
                                    )}
                                value={data.tags.map(t => t.name)}
                            />
                            <div className="flex flex-wrap gap-1">
                                {
                                    data.tags.map(
                                        t => <button
                                            key={t.name}
                                            onClick={
                                                () => setData("tags", [...data.tags.filter(i => i !== t)])}
                                        >
                                            <Tag>{t.name}</Tag>
                                        </button>
                                    )
                                }
                            </div>
                        </div>

                    </Field>
                </div>
                <div>
                    <Field className="flex flex-col gap-4">
                        <div>
                            <Label className="font-bold">{t("content.content")}</Label>
                            <Description className="text-sm text-secondary">{t("posts.article_content_description")}</Description>
                            <Error>{errors.content}</Error>
                        </div>
                        <div className="grow" >
                            <Editor
                                onChange={() =>
                                    setData(
                                        "content",
                                        editorRef.current?.getSemanticHTML() as string
                                    )
                                }
                                ref={editorRef}
                                placeholder={"..."}
                                className="border rounded border-secondary/25 min-h-96 py-8 container"
                            />
                        </div>
                    </Field>
                </div>
                <button
                    className="self-end rounded-md px-3.5 py-2.5 bg-primary text-onPrimary hover:bg-primary/90 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                    type="submit"
                >
                    {t("posts.publish")}
                </button>
            </form>
        </div>
    </Layout >
}
