import { useLaravelReactI18n } from "laravel-react-i18n"
import { Link, router } from "@inertiajs/react"
import { avatar } from "@/Utils/helpers/path"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import { ReactNode } from "react";

import type { Notification } from "@/types";

interface BaseProps {
    id: string;
    title: string;
    children?: ReactNode;
    src: string;
    alt?: string;
    className?: string;
    created_at: string;
    read_at?: string;
    url: string;
}

export const Base = ({ id, title, children, src, alt, className, created_at, read_at, url }: BaseProps) => {
    const formatDate = useRelativeDateFormat()

    return <Link
        href={`/notifications/${id}`}
        method="put"
        preserveScroll
        only={["auth"]}
        onSuccess={() => router.visit(url)}
        className={`mx-1 last:mb-1 flex max-w-full text-start gap-2 px-4 py-2 rounded-md transition-colors hover:bg-background-light/75 dark:hover:bg-background-dark/75 ${!read_at && "bg-background-light dark:bg-background-dark"}`}
    >
        <img
            className="flex rounded-full size-12"
            src={src}
            alt={alt}
        />
        <div className="text-xs flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-col gap-1 text-pretty">
                <div>{title}</div>
                {
                    children &&

                    <div className={"flex flex-col" + className}>
                        {children}
                    </div>
                }
            </div>
            <time className={`text-end text-xs text-gray-500`}>
                {formatDate(created_at)}
            </time>
        </div>
    </Link>
}

export const PostVoteReceived = ({ notification: n }: {notification: Notification }) => {
    const { t } = useLaravelReactI18n()

    return <Base
        id={n.id}
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at}
        read_at={n.read_at}
        className="flex flex-col"
        url={`/posts/${n.post.slug}`}
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
            }) as string
        }
    />
}


export const CommentVoteReceived = ({ notification: n }: {notification: Notification}) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={avatar(n.user.avatar)}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.slug}#comment-${n.comment.id}`}
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
            }) as string
        }
    />
}

export const CommentReceived = ({ notification: n }: {notification: Notification}) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.slug}#comment-${n.comment.id}`}
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
            }) as string
        }
    >
        <span className={`text-xs ${!n.read_at ? "font-bold" : "italic"}`}>"{n.comment.content}"</span>
    </Base>
}

export const ReplyReceived = ({ notification: n }: {notification: Notification}) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar} created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.slug}#reply-${n.reply.id}`}
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
            }) as string
        }
    >
        <span
            className={`text-xs ${!n.read_at ? "font-bold" : "italic"}`}
        >
            "{n.reply.content}"
        </span>
    </Base>
}

export const MissionAccomplished = ({ notification: n }: {notification: Notification}) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/missions/" + n.mission.image}
        created_at={n.created_at}
        read_at={n.read_at}
        id={n.id}
        url={`/profile/me#missions`}
        title={
            t("notifications.mission_accomplished", {
                mission_title:
                    <span className="font-bold">
                        {
                            n.mission.title
                        }
                    </span>
                ,
            }) as string
        }
    />
}

export const CommentMarked = ({ notification: n }: {notification: Notification}) => {
    const { t } = useLaravelReactI18n()

    return <Base
        src={"/images/users/" + n.user.avatar}
        created_at={n.created_at}
        read_at={n.read_at}
        id={n.id}
        url={`/posts/${n.post.slug}#comment-${n.comment.id}`}
        title={
            t("notifications.comment_marked", {
                author_fullname:
                    <span className="font-bold">
                        {
                            n.user.fullname
                        }
                    </span>
                ,
                post_title:
                    <span className="font-bold">
                        {
                            n.post.title
                        }
                    </span>
            }) as string
        }
    >
        <span
            className={`text-xs ${!n.read_at ? "font-bold" : "italic"}`}
        >
            "{n.comment.content}"
        </span>
    </Base>
}
