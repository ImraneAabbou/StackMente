import { useState } from "react"
import { Link, usePage, usePoll } from "@inertiajs/react";
import { NotificationType } from "@/types/notification";
import { CommentReceived, CommentVoteReceived, PostVoteReceived, ReplyReceived, MissionAccomplished, CommentMarked } from "@/Components/NotificationItems";

export default function NotificationsIndex() {
    const { auth } = usePage().props;
    const { notifications } = auth.user
    const [notificationsCount, setNotificationsCount] = useState(notifications.length)

    if (notifications.length > notificationsCount) {
        setNotificationsCount(notifications.length)
        alert(`length changed ${notifications.length} --- ${notificationsCount}`)
    }

    usePoll(2500, {
        only: ["auth"],
    })

    return <div>
        <Link href="/notifications" method="delete" only={["auth"]}>mark all as read</Link>

        <ul className="grid mx-auto max-w-md gap-1 p-2">
            {
                notifications.map(
                    n => {

                        switch (n.type) {
                            case NotificationType.POST_VOTE_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <PostVoteReceived notification={n} />
                                </li>

                            case NotificationType.COMMENT_VOTE_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <CommentVoteReceived notification={n} />
                                </li>

                            case NotificationType.COMMENT_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <CommentReceived notification={n} />
                                </li>

                            case NotificationType.REPLY_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <ReplyReceived notification={n} />
                                </li>

                            case NotificationType.MISSION_ACCOMPLISHED:
                                return <li
                                    key={n.id}
                                >
                                    <MissionAccomplished notification={n} />
                                </li>

                            case NotificationType.COMMENT_MARKED:
                                return <li
                                    key={n.id}
                                >
                                    <CommentMarked notification={n} />
                                </li>
                        }

                        return
                    }
                )
            }
        </ul>
    </div>
}
