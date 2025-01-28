import { useLaravelReactI18n } from "laravel-react-i18n"
import { Link, router } from "@inertiajs/react"

export const Base = ({ id, title, children = "", src, alt = "", className = "", created_at, read_at, url = "" }) => {

    return <Link
        href={`/notifications/${id}`}
        method="put"
        preserveScroll
        only={["auth"]}
        onSuccess={() => url ? router.visit(url) : null}
        className={`flex w-full text-start gap-2 px-4 py-2 rounded-md transition-colors ${read_at ? "bg-gray-50" : "hover:bg-gray-100 bg-gray-200"}`}
    >
        <img
            className="flex rounded-full size-12"
            src={src}
            alt={alt}
        />
        <div className="text-xs flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-col gap-1">
                <div>{title}</div>
                {
                    children &&

                    <div className={"flex flex-col" + className}>
                        {children}
                    </div>
                }
            </div>
            <time className={`text-end text-xs text-gray-500`}>
                {created_at}
            </time>
        </div>
    </Link>
}

export const PostVoteReceived = ({ notification: n }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        id={n.id}
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at}
        read_at={n.read_at}
        className="flex flex-col"
        url={`/posts/${n.post.id}`}
        title={
            t("notifications.post_vote_received", {
                voter_fullname:
                    <span
                        className="font-bold"
                    >
                        {
                            n.user.fullname
                        }
                    </span>
                ,
                post_title: <span className="font-bold">
                    {
                        n.post.title
                    }
                </span>
            })
        }
    />
}


export const CommentVoteReceived = ({ notification: n }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.id}#comment-${n.comment.id}`}
        title={
            t("notifications.comment_vote_received", {
                voter_fullname:
                    <span className="font-bold">
                        {
                            n.user.fullname
                        }
                    </span>
                ,
                post_title: <span className="font-bold">
                    {
                        n.post.title
                    }
                </span>,
                comment_content: <span className="text-xs italic">"{n.comment.content}"</span>
            })
        }
    />
}

export const CommentReceived = ({ notification: n }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.id}#comment-${n.comment.id}`}
        title={
            t("notifications.comment_received", {
                commenter_fullname:
                    <span className="font-bold">
                        {
                            n.user.fullname
                        }
                    </span>
                ,
                post_title: <span className="font-bold">
                    {
                        n.post.title
                    }
                </span>,
                comment_content: <span className="text-xs italic">"{n.comment.content}"</span>
            })
        }
    >
        <span className={`text-xs ${!n.read_at ? "font-bold" : "italic"}`}>"{n.comment.content}"</span>
    </Base>
}

export const ReplyReceived = ({ notification: n }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar} created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.id}#reply-${n.reply.id}`}
        title={
            t("notifications.reply_received", {
                replier_fullname:
                    <span className="font-bold">
                        {
                            n.user.fullname
                        }
                    </span>
                ,
                post_title: <span className="font-bold">
                    {
                        n.post.title
                    }
                </span>,
                reply_content: <span className="text-xs italic">"{n.reply.content}"</span>
            })
        }
    >
        <span
            className={`text-xs ${!n.read_at ? "font-bold" : "italic"}`}
        >
            "{n.reply.content}"
        </span>
    </Base>
}

export const MissionAccomplished = ({ notification: n }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/missions/" + n.mission.image}
        created_at={n.created_at}
        read_at={n.read_at}
        id={n.id}
        url={`/profile#missions`}
        title={
            t("notifications.mission_accomplished", {
                mission_title:
                    <span className="font-bold">
                        {
                            n.mission.title
                        }
                    </span>
                ,
            })
        }
    />
}
