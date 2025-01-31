import { router, useForm, usePage } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Link } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n";
import ReportForm from "@/Components/ReportForm";

export default function PostsIndex() {
    const { post, comments, is_commented, auth, status } = usePage().props;
    const [showReportForm, setShowReportForm] = useState(false)

    return <div>
        {status && <div className="p-4 text-center bg-green-400">{status}</div>}
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
                    only={["post"]}
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
                    only={["post"]}
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
                            href={`/tags/${t.id}`}
                            className="bg-gray-200 rounded p-1 py-0.5 text-xs"
                        >
                            {t.name}
                        </Link>
                    )
                }
            </div>
            <button onClick={() => setShowReportForm(!showReportForm)} className="text-red-400">report</button>
            <Link href={`/posts/${post.slug}/reports`} method="delete">clear reports</Link>
        </div>
        {
            showReportForm && <ReportForm action={`/posts/${post.slug}/reports`} />
        }
        <h2 className="font-bold text-2xl">Comments</h2>
        <div className="flex gap-4 flex-col">
            {
                comments
                    .map(comment => auth.user?.id === comment.user_id
                        ? <UpdatableComment key={comment.id} comment={comment} action={`/comments/${comment.id}`} />
                        : <Comment comment={comment} />
                    )
            }
        </div>
        {
            !is_commented && <CommentingForm action={`/posts/${post.slug}/comments`} />
        }
    </div>
}

const CommentingForm = ({ action }: { action: string }) => {
    const { errors, post, data, setData } = useForm(action, {
        content: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        post(action, {
            only: ["comments", "is_commented", "status"],
            preserveScroll: "errors",
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
            only: ["comments", "status"],
            preserveScroll: "errors",
            preserveState: "errors"
        })
    }

    return <form onSubmit={handleSubmit}>
        <input onChange={e => setData("content", e.target.value)} value={data.content} />
        <button type="submit">send</button>
        {errors.content && <p className="text-red-400">{errors.content}</p>}
    </form>
}
const UpdatableComment = ({ comment, action }) => {
    const { auth, post } = usePage().props
    const isPostOwned = auth.user?.id === post.user_id
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
            <img src={"/images/users/" + comment.user.avatar} className="size-12 rounded-full" />

            {
                isPostOwned
                    ? <Link href={`/comments/${comment.id}/mark`} method="put" only={["post", "comments"]}>
                        {
                            comment.is_marked
                                ? <div className="bg-green-600 size-8 inline-flex" />
                                : <div className="bg-gray-600 size-8 inline-flex" />
                        }
                    </Link>
                    : !!comment.is_marked
                    && <div className="bg-green-600 size-8 inline-flex" />
            }

            <Link href={`/profile/${comment.user.username}`} className="font-bold">
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
                            comment.replies.map(r => r.user_id === auth.user?.id
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

const Comment = ({ comment }) => {
    const { auth, post } = usePage().props
    const [showReportForm, setShowReportForm] = useState(false)
    const isPostOwned = auth.user?.id === post.user_id

    return <div className="p-4 target:border-2" id={`comment-${comment.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + comment.user.avatar} className="size-12 rounded-full" />
            {
                isPostOwned
                    ? <Link href={`/comments/${comment.id}/mark`} method="put" only={["post", "comments"]}>
                        {
                            comment.is_marked
                                ? <div className="bg-green-600 size-8 inline-flex" />
                                : <div className="bg-gray-600 size-8 inline-flex" />
                        }
                    </Link>
                    : !!comment.is_marked
                    && <div className="bg-green-600 size-8 inline-flex" />
            }
            <Link href={`/profile/${comment.user.username}`} className="font-bold">
                {comment.user_id === auth.user?.id ? t("common.you") : comment.user.fullname}
            </Link>
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
                            comment.replies.map(r => r.user_id === auth.user?.id
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

const UpdatableReply = ({ reply, action }) => {
    const [editable, setEditable] = useState(false)
    const {t} = useLaravelReactI18n()
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
            <img src={"/images/users/" + reply.user.avatar} className="size-6 rounded-full" />
            <Link href={`/profile/${reply.user.username}`} className="font-bold">
                {t('common.you')}
            </Link>
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

const Reply = ({ reply }) => {
    const [showReportForm, setShowReportForm] = useState(false)

    return <li className="border-b-black target:border-2" id={`reply-${reply.id}`}>
        <div className="flex gap-2 items-center">
            <img src={"/images/users/" + reply.user.avatar} className="size-6 rounded-full" />
            <Link href={`/profile/${reply.user.username}`} className="font-bold">
                {reply.user.fullname}
            </Link>
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
