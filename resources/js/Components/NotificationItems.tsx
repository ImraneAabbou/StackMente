import { useLaravelReactI18n } from "laravel-react-i18n"
import { Link, router } from "@inertiajs/react"
import { avatar } from "@/Utils/helpers/path"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import { ReactNode } from "react";
import type {
    CommentMarkedNotification,
    CommentReceivedNotification,
    CommentVoteReceivedNotification,
    MissionAccomplishedNotification,
    NotificationBase,
    PostVoteReceivedNotification,
    ReplyReceivedNotification
} from "@/types/notification";


interface BaseNotificationProps extends NotificationBase {
    title: string;
    children?: ReactNode;
    src: string;
    alt?: string;
    className?: string;
    url: string;
}

export const BaseNotification = ({ id, title, children, src, alt, className, created_at, read_at, url }: BaseNotificationProps) => {
    const formatDate = useRelativeDateFormat()

    return <Link
        href={route("notifications.update", { id })}
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
            <time className={`text-end text-xs text-secondary`}>
                {formatDate(created_at)}
            </time>
        </div>
    </Link>
}

export const PostVoteReceived = ({ notification: n }: { notification: PostVoteReceivedNotification }) => {
    const { t } = useLaravelReactI18n()
    const routeName = n.post.type.toLowerCase() + "s.show"

    return <BaseNotification
        id={n.id}
        src={avatar(n.user.avatar)}
        created_at={n.created_at}
        read_at={n.read_at}
        className="flex flex-col"
        url={route(routeName, { post: n.post.slug })}
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

export const CommentVoteReceived = ({ notification: n }: { notification: CommentVoteReceivedNotification }) => {
    const { t } = useLaravelReactI18n()
    const routeName = n.post.type.toLowerCase() + "s.show"

    return <BaseNotification
        src={avatar(n.user.avatar)}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={route(routeName, { post: n.post.slug }) + (n.comment.is_marked ? "#answer" : `#comment-${n.comment.id}`)}
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

export const CommentReceived = ({ notification: n }: { notification: CommentReceivedNotification }) => {
    const { t } = useLaravelReactI18n()
    const routeName = n.post.type.toLowerCase() + "s.show"

    return <BaseNotification
        src={avatar(n.user.avatar)}
        created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={route(routeName, { post: n.post.slug }) + (n.comment.is_marked ? "#answer" : `#comment-${n.comment.id}`)}
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
    </BaseNotification>
}

export const ReplyReceived = ({ notification: n }: { notification: ReplyReceivedNotification }) => {
    const { t } = useLaravelReactI18n()
    const routeName = n.post.type.toLowerCase() + "s.show"

    return <BaseNotification
        src={avatar(n.user.avatar)} created_at={n.created_at} read_at={n.read_at}
        id={n.id}
        url={route(routeName, { post: n.post.slug }) + `#reply-${n.reply.id}`}
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
    </BaseNotification>
}

export const MissionAccomplished = ({ notification: n }: { notification: MissionAccomplishedNotification }) => {
    const { t } = useLaravelReactI18n()

    return <BaseNotification
        src={"/images/missions/" + n.mission.image}
        created_at={n.created_at}
        read_at={n.read_at}
        id={n.id}
        url={route("profile.me") + `#missions`}
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

export const CommentMarked = ({ notification: n }: { notification: CommentMarkedNotification }) => {
    const { t } = useLaravelReactI18n()
    const routeName = n.post.type.toLowerCase() + "s.show"

    return <BaseNotification
        src={avatar(n.user.avatar)}
        created_at={n.created_at}
        read_at={n.read_at}
        id={n.id}
        url={route(routeName, { post: n.post.slug }) + (n.comment.is_marked ? "#answer" : `#comment-${n.comment.id}`)}
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
    </BaseNotification>
}
