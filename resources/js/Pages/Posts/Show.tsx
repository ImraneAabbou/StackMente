import { router, useForm, usePage } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Link } from "@inertiajs/react"
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";

export default function PostsIndex() {
    const { post, comments: initialComments, is_commented, next_page_url, auth, status } = usePage().props;
    const [comments, setComments] = useState(initialComments);

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
                comments.map(c => <div key={c.id} className="p-4" key={c.id}>
                    {
                        auth.user.id === c.user_id
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
                    {c.is_marked ? <div className="bg-green-600 size-4 inline-flex" /> : null}
                    <small>{c.user.fullname}</small>
                    <p>{c.content}</p>
                    <div className="flex gap-1 items-center">
                        <Link
                            href={`/comments/${c.id}/vote`}
                            method={c.user_vote === "UP" ? "delete" : "post"}
                            data={{
                                type: "UP"
                            }}
                            preserveScroll
                            preserveState={false}
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
                            className={c.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
                        >
                            {c.down_votes_count} down
                        </Link>
                    </div>
                </div>)
            }
        </div>
        {
            next_page_url
                ? <InfiniteScrollLoader
                    url={next_page_url}
                    onSuccess={page => setComments([...comments, ...page.props.comments])}
                >
                    hi
                </InfiniteScrollLoader>
                : null
        }
        {
            !is_commented && <CommentingForm action={`/posts/${post.id}/comments`} />
        }
        {status}
    </div>
}

const CommentingForm = ({ action }: { action: string }) => {
    const { errors, post, data, setData } = useForm(action, {
        content: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        post(action, {
            only: ["comments", "is_commented", "next_page_url"],
            preserveState: false
        })
    }

    return <form onSubmit={handleSubmit}>
        <textarea onChange={e => setData("content", e.target.value)} value={data.content} />
        {errors.content && <p className="text-red-400">{errors.content}</p>}
        <button type="submit">send</button>
    </form>
}
