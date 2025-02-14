import { router, useForm, usePage } from "@inertiajs/react";
import { FormEvent, useContext, useRef, useState } from "react";
import { Link } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n";
import ReportForm from "@/Components/ReportForm";
import { Reply as ReplyType } from "@/types/reply";
import { Comment as CommentType } from "@/types/comment"
import Layout from "@/Layouts/Layout";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import Tag from "@/Components/ui/Tag";
import UpVote from "@/Components/icons/UpVote";
import { FormattedNumber } from "react-intl";
import clsx from "clsx";
import DownVote from "@/Components/icons/DownVote";
import Check from "@/Components/icons/Check";
import { avatar } from "@/Utils/helpers/path";
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat";
import { Post as PostType } from "@/types/post";
import Editor from "@/Components/ui/Editor"
import Flag from "@/Components/icons/Flag";
import Quill from "quill";
import { ToolbarConfig } from "quill/modules/toolbar";
import Error from "@/Components/ui/Error";

export default function PostsIndex() {
    const { post: { comments, is_commented, ...post }, auth: { user } } = usePage().props;

    return <Layout>
        <div className="max-w-4xl mx-auto my-8">
            <Post p={post} />
            <div className="flex gap-8 flex-col mt-16">
                {
                    comments
                        .map(comment => <Comment key={comment.id} comment={comment} />
                        )
                }
                {
                    !is_commented && <CommentingForm action={route('comments.store', { post: post.slug })} />
                }
            </div>
        </div>
    </Layout>
}

const COMMENT_EDITOR_TOOLBAR: ToolbarConfig = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],

    [{ 'align': [] }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],

    ['link', 'image', 'video', 'formula'],

    [{ 'script': 'sub' }, { 'script': 'super' }],

    ['clean']
]

const CommentingForm = ({ action }: { action: string }) => {
    const { auth: { user } } = usePage().props
    const editorRef = useRef<Quill | null>(null)
    const { t } = useLaravelReactI18n()
    const { errors, post, setData } = useForm(action, {
        content: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        post(action, {
            onSuccess: page => {
                router.visit(page.url + "#comment-" + page.props.post.comments.find(c => c.user_id === user.id)?.id)
            },
            preserveScroll: true,
            preserveState: "errors"
        })
    }

    return <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
            <img src={avatar(user.avatar)} className="size-8 rounded-full" />
            <span className="font-bold">
                {t("common.you")}
            </span>
        </div>
        <Editor
            ref={editorRef}
            toolbar={COMMENT_EDITOR_TOOLBAR}
            onChange={() =>
                setData(
                    "content",
                    editorRef.current?.getSemanticHTML() as string
                )
            }
            placeholder="..."
            className="border rounded border-secondary/25 min-h-24 ms-12 p-4"
        />
        <div className="flex gap-4 flex-wrap">
            <Error className="ms-14">{errors.content}</Error>
            <button
                className="ms-auto rounded-md px-3.5 py-2.5 bg-primary text-onPrimary hover:bg-primary/90 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                type="submit"
            >
                {t("content.send")}
            </button>
        </div>
    </form>
}

const ReplyingForm = ({ action }: { action: string }) => {
    const { errors, post, data, setData } = useForm(action, {
        content: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        post(action, {
            preserveScroll: true,
        })
    }

    return <form onSubmit={handleSubmit}>
        <input onChange={e => setData("content", e.target.value)} value={data.content} />
        <button type="submit">send</button>
        {errors.content && <p className="text-red-400">{errors.content}</p>}
    </form>
}

const Comment = ({ comment }: { comment: CommentType }) => {
    const { auth: { user }, post } = usePage().props
    const isPostOwned = user?.id === post.user_id
    const { t } = useLaravelReactI18n()
    const { setReportAction } = useContext(ReportActionCtx)
    const formatDate = useRelativeDateFormat()
    const [editable, setEditable] = useState(false)
    const action = route("comments.update", { comment: comment.id })
    const { errors, data, setData, put, isDirty } = useForm(action, {
        content: comment.content
    })
    const editorRef = useRef<Quill | null>(null)

    const handleCommentUpdate = () => {

        if (!isDirty) return setEditable(false)

        put(action, {
            onSuccess: () => {
                setEditable(false)
                router.visit(`#comment-${comment.id}`)
            }

        })
    }

    return <div className="target:border-2 p-2 rounded" id={comment.is_marked ? "answer" : `comment-${comment.id}`}>
        <div className="flex flex-wrap justify-between items-center">
            <div className="flex gap-4 flex-warp items-center">
                <Link href={comment.user ? route("profile.show", { user: comment.user?.username }) : "#"} className="flex gap-2 items-center">
                    <img src={avatar(comment?.user?.avatar)} className="size-12 rounded-full" />
                    {
                        comment.user
                            ? <span className="font-semibold">
                                {comment.user_id === user?.id ? t("common.you") : comment.user?.fullname}
                            </span>
                            : <span className="font-bold text-secondary">Someone</span>
                    }
                </Link>
                {
                    isPostOwned
                        ? <Link href={route("comments.mark", { comment: comment.id })} method="put" className="flex gap-2 items-center">
                            {
                                <span
                                    className={
                                        comment.is_marked
                                            ? `text-success-light dark:text-success-dark hover:text-secondary`
                                            : `hover:text-success-light  hover:dark:text-success-dark text-secondary`
                                    }
                                >
                                    <Check size={16} />
                                </span>
                            }
                        </Link>
                        : !!comment.is_marked
                        && <span className="text-success-light dark:text-success-dark"><Check size={16} /></span>
                }
            </div>
            <div className="ms-auto text-xs ">
                {
                    comment.user_id !== user.id
                        ? <button
                            className="flex gap-1 font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-error-light dark:text-error-dark"
                            onClick={
                                () => setReportAction(route("comments.report", { reportable: comment.id }))
                            }
                        >
                            {t("content.report")}
                            <Flag size={12} />
                        </button>
                        : <button
                            form="comment-edit-form"
                            className={
                                clsx(
                                    `flex gap-1 items-center`,
                                    !editable ? "text-secondary hover:text-current" : "px-2 py-1 rounded hover:bg-secondary/50 bg-secondary/25",
                                )
                            }
                            type={editable ? "submit" : "button"}
                            onClick={
                                () => {
                                    if (editable) handleCommentUpdate()
                                    setEditable(!editable)
                                }
                            }
                        >
                            {editable ? t('content.save') : t('content.edit')}
                        </button>
                }
            </div>
        </div>
        <Editor
            ref={editorRef}
            className="sm:ms-12 mt-4 sm:mt-0"
            toolbar={COMMENT_EDITOR_TOOLBAR}
            readOnly={!((comment.user_id === user.id) && editable)}
            defaultValue={comment.content}
            onChange={() =>
                setData(
                    "content",
                    editorRef.current?.getSemanticHTML() as string
                )
            }
        />
        <Error>{errors.content}</Error>
        <div className="flex flex-wrap-reverse gap-4 sm:ps-12 justify-between items-center mt-4">
            <div className="flex gap-2 items-center">
                <Link
                    href={route("comments.vote", {
                        votable: comment.id
                    })}
                    method={comment.user_vote === "UP" ? "delete" : "post"}
                    data={{
                        type: "UP"
                    }}
                    preserveScroll
                    preserveState={false}
                    onSuccess={() => router.visit(`#comment-${comment.id}`)}
                    className={
                        clsx(
                            "font-semibold rounded-full p-2.5 flex text-xs items-center gap-2",
                            comment.user_vote === "UP"
                                ? "bg-success-light/25 dark:bg-success-dark/25 text-success-light dark:text-success-dark"
                                : "bg-secondary/10 hover:bg-secondary/25"
                        )
                    }
                >
                    <UpVote size={16} />
                    <span>
                        <FormattedNumber value={comment.up_votes_count} style="decimal" notation="compact" />
                    </span>
                </Link>
                <Link
                    href={route("comments.vote", {
                        votable: comment.id
                    })}
                    method={comment.user_vote === "DOWN" ? "delete" : "post"}
                    data={{
                        type: "DOWN"
                    }}
                    preserveScroll
                    preserveState={false}
                    onSuccess={() => router.visit(`#comment-${comment.id}`)}
                    className={
                        clsx(
                            "font-semibold rounded-full p-2.5 flex items-center text-xs gap-2",
                            comment.user_vote === "DOWN"
                                ? "bg-error-light/25 dark:bg-error-dark/25 text-error-light dark:text-error-dark"
                                : "bg-secondary/10 hover:bg-secondary/25"
                        )
                    }
                >
                    <DownVote size={16} />
                    <span>
                        <FormattedNumber value={comment.down_votes_count} style="decimal" notation="compact" />
                    </span>
                </Link>
            </div>
            <div className="flex gap-1 ms-auto flex-wrap text-xs text-secondary">
                <span>
                    {formatDate(comment.created_at)}
                </span>
                {
                    comment.updated_at !== comment.created_at
                    && <div className="flex gap-1">
                        /
                        <span className="">{t("content.modified")}</span>
                        <span>
                            {formatDate(comment.updated_at)}
                        </span>
                    </div>
                }
            </div>
        </div>
        {
            comment.replies_count
                ? <details>
                    <summary>{comment.replies_count} replies</summary>
                    <ul className="flex gap-2 flex-col ms-12">
                        {
                            comment.replies.map(r => r.user_id === user?.id
                                ? <UpdatableReply reply={r} action={`/replies/${r.id}`} key={r.id} />
                                : <Reply reply={r} key={r.id} />
                            )
                        }
                        <li>
                            <ReplyingForm action={`/comments/${comment.id}/replies`} />
                        </li>
                    </ul>
                </details>
                : <ReplyingForm action={`/comments/${comment.id}/replies`} />
        }
    </div >
}

const UpdatableReply = ({ reply, action }: { reply: ReplyType, action: string }) => {
    const [editable, setEditable] = useState(false)
    const { t } = useLaravelReactI18n()
    const { errors, data, setData, put, isDirty } = useForm(action, {
        content: reply.content
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!isDirty) return setEditable(false)

        put(action, {
            onSuccess: () => {
                setEditable(false)
                router.visit(`#reply-${reply.id}`)
            }

        })
    }

    return <li className="border-b-black target:border-2" id={`reply-${reply.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + reply.user?.avatar} className="size-6 rounded-full" />
            {
                !!reply.user
                    ? <Link href={`/profile/${reply.user.username}`} className="font-bold">
                        {t('common.you')}
                    </Link>
                    : <span className="font-bold">Someone</span>
            }
            {
                !editable
                && <button onClick={() => setEditable(true)}>edit</button>
            }
            <Link
                href={`/replies/${reply.id}`}
                method="delete"
                preserveState={false}
                className="text-red-400"
            >
                delete
            </Link>
        </div>
        {
            editable
                ? <form onSubmit={handleSubmit}>
                    <input
                        onChange={e => setData("content", e.target.value)}
                        value={data.content ?? reply.content}
                        className="text-gray-600 text-sm ms-8"
                    />
                    <button type="submit">save</button>
                </form>
                : <p>
                    {reply.content}
                </p>
        }
        {errors.content && <p className="text-red-400 text-sm">{errors.content}</p>}
    </li>
}

const Reply = ({ reply }: { reply: ReplyType }) => {
    const [showReportForm, setShowReportForm] = useState(false)

    return <li className="border-b-black target:border-2" id={`reply-${reply.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + reply.user?.avatar} className="size-6 rounded-full" />
            {
                !!reply.user
                    ? <Link href={`/profile/${reply.user.username}`} className="font-bold">
                        {reply.user.fullname}
                    </Link>
                    : <span className="font-bold">Someone</span>
            }
        </div>
        <p className="text-gray-600 text-sm ms-8">
            {reply.content}
        </p>
        <button onClick={() => setShowReportForm(!showReportForm)} className="text-red-400">report</button>
        {
            showReportForm && <ReportForm action={`/replies/${reply.id}/reports`} />
        }
    </li>
}

const Post = ({ p }: { p: PostType }) => {
    const { t } = useLaravelReactI18n()
    const formatDate = useRelativeDateFormat()
    const { user } = usePage().props.auth
    const { setReportAction } = useContext(ReportActionCtx)

    return <main>
        <div className="flex flex-col gap-2 border-b border-secondary/50 mb-4">
            <h1 className="text-4xl font-bold">
                {p.title}
            </h1>
            <div className="flex text-sm flex-wrap items-center gap-8 text-secondary p-4">
                <div className="flex flex-wrap gap-4 italic">
                    <div className="flex gap-1">
                        <span>
                            <FormattedNumber value={p.views} style="decimal" notation="compact" />
                        </span>
                        <span className="">{t("content.views")}</span>
                    </div>
                    <div className="flex gap-1">
                        <span>
                            <FormattedNumber value={p.comments_count} style="decimal" notation="compact" />
                        </span>
                        <span className="">{t("content.comments")}</span>
                    </div>
                    {
                        p.answer_exists &&
                        <Link
                            href={"#answer"}
                            className="font-semibold text-success-light dark:text-success-dark flex gap-1 items-center"
                        >
                            <Check size={16} />
                            {t("content.answered")}
                        </Link>
                    }
                </div>
                <button
                    className="flex gap-2 ms-auto font-semibold opacity-75 hover:opacity-100 shrink-0 items-center text-error-light dark:text-error-dark"
                    onClick={
                        () => setReportAction(route("posts.report", { reportable: p.slug }))
                    }
                >
                    {t("content.report")}
                    <Flag size={16} />
                </button>
            </div>
        </div>

        <Editor readOnly defaultValue={p.content} />

        <div className="flex md:flex-row justify-between flex-col-reverse mt-4">
            <div className="flex gap-2 sm:mb-4 items-center">
                <Link
                    href={route("posts.vote", {
                        votable: p.slug
                    })}
                    method={p.user_vote === "UP" ? "delete" : "post"}
                    data={{
                        type: "UP"
                    }}
                    preserveScroll
                    preserveState={false}
                    className={
                        clsx(
                            "font-semibold rounded-full p-2.5 flex text-xs items-center gap-2",
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
            <div>
                <div className="flex gap-2 sm:gap-4 flex-wrap text-xs text-secondary justify-end mt-2">
                    <div className="flex gap-1">
                        <span className="">Published</span>
                        <span>
                            {formatDate(p.created_at)}
                        </span>
                    </div>
                    {
                        p.updated_at !== p.created_at
                        && <div className="flex gap-1">
                            <span className="">{t("content.modified")}</span>
                            <span>
                                {formatDate(p.updated_at)}
                            </span>
                        </div>
                    }
                    <Link
                        href={route("profile.show", { user: p.user.username })}
                        className="flex gap-1 items-center font-bold text-onBackground-dark dark:text-onBackground-light"
                    >
                        <img className="size-4 rounded-full" src={avatar(p.user.avatar)} alt={p.user.fullname} />
                        {
                            p.user_id === user?.id
                                ? t("common.you")
                                : p.user.username
                        }
                    </Link>
                </div>
                <div className="flex flex-row gap-1 items-end justify-end flex-wrap mt-2 mb-4">
                    {p.tags.map(t => <Link key={t.name} href={route("feed", { _query: { included_tags: [t.name] } })}><Tag {...t} >{t.name}</Tag></Link>)}
                </div>
            </div>
        </div>
    </main>
}
