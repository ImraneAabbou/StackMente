import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react"
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";
import AuthLayout from "@/Layouts/AuthLayout";

export default function PostsIndex() {
    const { posts: initialPosts, next_page_url } = usePage().props;
    const [posts, setPosts] = useState(initialPosts)

    console.log(initialPosts)

    return <AuthLayout>
        {
            posts.map(p => <div className="p-4 mb-8" key={p.id}>
                <Link href={`/posts/${p.slug}`}>{p.type}: {p.title} <small className="text-gray-500">{p.views} views</small></Link>
                <p className="text-gray-600">{p.content}</p>
                <div className="flex gap-2 items-center">
                    <Link
                        href={`/posts/${p.slug}/vote`}
                        method={p.user_vote === "UP" ? "delete" : "post"}
                        data={{
                            type: "UP"
                        }}
                        only={["posts", "next_page_url"]}
                        preserveScroll
                        preserveState={false}
                        className={p.user_vote === "UP" ? "bg-gray-400 rounded-full p-2" : ""}
                    >
                        {p.up_votes_count} up
                    </Link>
                    <Link
                        href={`/posts/${p.slug}/vote`}
                        method={p.user_vote === "DOWN" ? "delete" : "post"}
                        data={{
                            type: "DOWN"
                        }}
                        only={["posts", "next_page_url"]}
                        preserveScroll
                        preserveState={false}
                        className={p.user_vote === "DOWN" ? "bg-gray-400 rounded-full p-2" : ""}
                    >
                        {p.down_votes_count} down
                    </Link>
                    <small className="text-gray-800">{p.comments_count} comments</small>
                </div>
                <div className="flex gap-1 justify-end">
                    {p.tags.map(t => <Link key={t.id} href={`/tags/${t.id}`} className="bg-gray-200 rounded p-1 py-0.5 text-xs">{t.name}</Link>)}
                </div>
            </div>)
        }
        {next_page_url &&
            <InfiniteScrollLoader
                url={next_page_url}
                onSuccess={page => setPosts([...posts, ...page.props.posts])}
            >
                fetching more...
            </InfiniteScrollLoader>}
    </AuthLayout>
}
