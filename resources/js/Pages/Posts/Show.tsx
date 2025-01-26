import { router, useForm, usePage } from "@inertiajs/react";
import { FormEvent } from "react";
import { Link } from "@inertiajs/react"

export default function PostsIndex() {
    const { post, comments, is_commented, auth, status } = usePage().props;

    return <div>
        {status && <div className="p-4 text-center bg-green-400">{status}</div>}
        <div className="p-4 mb-8">
            <h1>{post.type}: {post.title} <small className="text-gray-500">{post.views} views</small></h1>
            <p className="text-gray-600">{post.content}</p>
            <div className="flex gap-1 items-center">
                <Link
                    href={`/posts/${post.id}/vote`}
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
                    href={`/posts/${post.id}/vote`}
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
        </div>
        <h2 className="font-bold text-2xl">Comments</h2>
        <div className="flex gap-4 flex-col">
            {
                comments.map(c => <div key={c.id} className="p-4 target:border-2" key={c.id} id={`comment-${c.id}`}>
                    <div className="flex gap-2 items-center">
                        <img src={"/images/users/" + c.user.avatar} className="size-12 rounded-full" />
                        {c.is_marked ? <div className="bg-green-600 size-4 inline-flex" /> : null}
                        <small className="font-bold">{c.user.fullname}</small>
                        <small>{c.replies_count} replies</small>
                        {
                            auth.user?.id === c.user_id
                            &&
                            <Link
                                href={`/comments/${c.id}`}
                                method="delete"
                                preserveState={false}
                                className="text-red-400"
                            >
                                delete
                            </Link>
                        }
                    </div>
                    <p className="ms-14">{c.content}</p>
                    <div className="flex gap-1 items-center">
                        <Link
                            href={`/comments/${c.id}/vote`}
                            method={c.user_vote === "UP" ? "delete" : "post"}
                            data={{
                                type: "UP"
                            }}
                            preserveScroll
                            preserveState={false}
                            onSuccess={() => router.visit(`#comment-${c.id}`)}
                            className={c.user_vote === "UP" ? "bg-gray-400 rounded-full p-2" : ""}
                        >
                            {c.up_votes_count} up
                        </Link>
                        <Link
                            href={`/comments/${c.id}/vote`}
                            method={c.user_vote === "DOWN" ? "delete" : "post"}
                            data={{
                                type: "DOWN"
                            }}
                            preserveScroll
                            preserveState={false}
                            onSuccess={() => router.visit(`#comment-${c.id}`)}
                            className={c.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
                        >
                            {c.down_votes_count} down
                        </Link>
                    </div>
                    <ul className="flex gap-2 flex-col ms-12">{
                        !!c.replies_count &&
                        c.replies.map(r => <li key={r.id} className="border-b-black target:border-2" id={`reply-${r.id}`}>
                            <div className="flex gap-2 items-center">
                                <img src={"/images/users/" + r.user.avatar} className="size-6 rounded-full" />
                                <small className="font-bold">{r.user.fullname}</small>
                                {
                                    auth.user?.id === r.user_id
                                    &&
                                    <Link
                                        href={`/replies/${r.id}`}
                                        method="delete"
                                        preserveState={false}
                                        className="text-red-400"
                                    >
                                        delete
                                    </Link>
                                }
                            </div>
                            <p className="text-gray-600 text-sm ms-8">
                                {r.content}
                            </p>
                        </li>)
                    }
                        <li>
                            <ReplyingForm action={`/comments/${c.id}/replies`} />
                        </li>
                    </ul>
                </div>
                )
            }
        </div>
        {
            !is_commented && <CommentingForm action={`/posts/${post.id}/comments`} />
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
