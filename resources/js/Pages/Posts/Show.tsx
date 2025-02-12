import { router, useForm, usePage } from "@inertiajs/react";
import { FormEvent, useContext, useState } from "react";
import { Link } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n";
import ReportForm from "@/Components/ReportForm";
import { Reply as ReplyType } from "@/types/reply";
import { Comment as CommentType } from "@/types/comment"
import Layout from "@/Layouts/Layout";
import ReportActionCtx from "@/Contexts/ReportActionCtx";
import Tag from "@/Components/ui/Tag";

export default function PostsIndex() {
    const { post: { comments, is_commented, ...post }, auth: { user } } = usePage().props;
    const { setReportAction } = useContext(ReportActionCtx)

    return <Layout>
        <div className="p-4 mb-8">
            <h1>{post.type}: {post.title} <small className="text-gray-500">{post.views} views</small></h1>
            <p className="text-gray-600">{post.content}</p>
            <div className="flex gap-1 items-center">
                <Link
                    href={`/posts/${post.slug}/vote`}
                    method={post.user_vote === "UP" ? "delete" : "post"}
                    data={{
                        type: "UP"
                    }}
                    preserveState={false}
                    preserveScroll
                    className={post.user_vote === "UP" ? "bg-gray-400 rounded-full p-2" : ""}
                >
                    {post.up_votes_count} up
                </Link>
                <Link
                    href={`/posts/${post.slug}/vote`}
                    method={post.user_vote === "DOWN" ? "delete" : "post"}
                    data={{
                        type: "DOWN"
                    }}
                    preserveState={false}
                    preserveScroll
                    className={post.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
                >
                    {post.down_votes_count} down
                </Link>
                <small className="text-gray-800">{post.comments_count} comments </small>
            </div>
            <div className="flex gap-1 justify-end">
                {
                    post.tags.map(
                        t => <Link
                            key={t.id}
                            href={route(`feed`, { _query: { included_tags: [t] } })}
                        >
                            <Tag>
                                {t.name}
                            </Tag>
                        </Link>
                    )
                }
            </div>
            <button
                onClick={
                    () => setReportAction(route("reports.store", { reportable: post.slug }))
                }
                className="text-red-400"
            >
                report
            </button>
            <Link href={`/posts/${post.slug}/reports`} method="delete">clear reports</Link>
        </div>
        <h2 className="font-bold text-2xl">Comments</h2>
        <div className="flex gap-4 flex-col">
            {
                comments
                    .map(comment => user?.id === comment.user_id
                        ? <UpdatableComment key={comment.id} comment={comment} action={`/comments/${comment.id}`} />
                        : <Comment key={comment.id} comment={comment} />
                    )
            }
        </div>
        {
            !is_commented && <CommentingForm action={`/posts/${post.slug}/comments`} />
        }
    </Layout>
}

const CommentingForm = ({ action }: { action: string }) => {
    const { auth: { user } } = usePage().props
    const { errors, post, data, setData } = useForm(action, {
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

    return <form onSubmit={handleSubmit}>
        <textarea onChange={e => setData("content", e.target.value)} value={data.content} />
        {errors.content && <p className="text-red-400">{errors.content}</p>}
        <button type="submit">send</button>
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
const UpdatableComment = ({ comment, action }: { comment: CommentType, action: string }) => {
    const { auth: { user }, post } = usePage().props
    const isPostOwned = user?.id === post.user_id
    const [editable, setEditable] = useState(false)
    const { errors, data, setData, put, isDirty } = useForm(action, {
        content: comment.content
    })
    const { t } = useLaravelReactI18n()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!isDirty) return setEditable(false)

        put(action, {
            onSuccess: () => {
                setEditable(false)
                router.visit(`#comment-${comment.id}`)
            }

        })
    }

    return <div className="p-4 target:border-2" id={`comment-${comment.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + comment.user?.avatar} className="size-12 rounded-full" />

            {
                isPostOwned
                    ? <Link href={`/comments/${comment.id}/mark`} method="put">
                        {
                            comment.is_marked
                                ? <div className="bg-green-600 size-8 inline-flex" />
                                : <div className="bg-gray-600 size-8 inline-flex" />
                        }
                    </Link>
                    : !!comment.is_marked
                    && <div className="bg-green-600 size-8 inline-flex" />
            }

            <Link href={`/profile/${comment.user?.username}`} className="font-bold">
                {t("common.you")}
            </Link>
            <small>{comment.replies_count} replies</small>
            {
                !editable
                && <button onClick={() => setEditable(true)}>edit</button>
            }
            <Link
                href={`/comments/${comment.id}`}
                method="delete"
                preserveState={false}
                preserveScroll
                className="text-red-400"
            >
                delete
            </Link>
        </div>
        {
            editable
                ? <form onSubmit={handleSubmit}>
                    <textarea
                        onChange={e => setData("content", e.target.value)}
                        value={data.content ?? comment.content}
                        className="text-gray-600 text-sm ms-8"
                    />
                    <button type="submit">save</button>
                </form>
                : <p className="ms-16">
                    {comment.content}
                </p>
        }
        {errors.content && <p className="text-red-400 text-sm">{errors.content}</p>}
        <div className="flex gap-1 items-center">
            <Link
                href={`/comments/${comment.id}/vote`}
                method={comment.user_vote === "UP" ? "delete" : "post"}
                data={{
                    type: "UP"
                }}
                preserveScroll
                preserveState={false}
                onSuccess={() => router.visit(`#comment-${comment.id}`)}
                className={comment.user_vote === "UP" ? "bg-gray-400 rounded-full p-2" : ""}
            >
                {comment.up_votes_count} up
            </Link>
            <Link
                href={`/comments/${comment.id}/vote`}
                method={comment.user_vote === "DOWN" ? "delete" : "post"}
                data={{
                    type: "DOWN"
                }}
                preserveScroll
                preserveState={false}
                onSuccess={() => router.visit(`#comment-${comment.id}`)}
                className={comment.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
            >
                {comment.down_votes_count} down
            </Link>
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
    </div>
}

const Comment = ({ comment }: { comment: CommentType }) => {
    const { auth: { user }, post } = usePage().props
    const [showReportForm, setShowReportForm] = useState(false)
    const isPostOwned = user?.id === post.user_id
    const { t } = useLaravelReactI18n()

    return <div className="p-4 target:border-2" id={`comment-${comment.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + comment.user?.avatar} className="size-12 rounded-full" />
            {
                isPostOwned
                    ? <Link href={`/comments/${comment.id}/mark`} method="put">
                        {
                            comment.is_marked
                                ? <div className="bg-green-600 size-8 inline-flex" />
                                : <div className="bg-gray-600 size-8 inline-flex" />
                        }
                    </Link>
                    : !!comment.is_marked
                    && <div className="bg-green-600 size-8 inline-flex" />
            }
            {
                !!comment.user
                    ? <Link href={`/profile/${comment.user.username}`} className="font-bold">
                        {comment.user_id === user?.id ? t("common.you") : comment.user.fullname}
                    </Link>
                    : <span className="font-bold">Someone</span>
            }
            <small>{comment.replies_count} replies</small>
        </div>
        <p className="ms-14">{comment.content}</p>
        <div className="flex gap-1 items-center">
            <Link
                href={`/comments/${comment.id}/vote`}
                method={comment.user_vote === "UP" ? "delete" : "post"}
                data={{
                    type: "UP"
                }}
                preserveScroll
                preserveState={false}
                onSuccess={() => router.visit(`#comment-${comment.id}`)}
                className={comment.user_vote === "UP" ? "bg-gray-400 rounded-full p-2" : ""}
            >
                {comment.up_votes_count} up
            </Link>
            <Link
                href={`/comments/${comment.id}/vote`}
                method={comment.user_vote === "DOWN" ? "delete" : "post"}
                data={{
                    type: "DOWN"
                }}
                preserveScroll
                preserveState={false}
                onSuccess={() => router.visit(`#comment-${comment.id}`)}
                className={comment.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
            >
                {comment.down_votes_count} down
            </Link>
            <button onClick={() => setShowReportForm(!showReportForm)} className="text-red-400">report</button>
        </div>
        {
            showReportForm && <ReportForm action={`/comments/${comment.id}/reports`} />
        }
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
    </div>
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
