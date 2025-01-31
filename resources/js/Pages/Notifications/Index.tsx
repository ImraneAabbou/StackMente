import { useState } from "react"
import { Link, usePage, usePoll } from "@inertiajs/react";
import {
    CommentReceived,
    CommentVoteReceived,
    PostVoteReceived,
    ReplyReceived,
    MissionAccomplished,
    CommentMarked
} from "@/Components/NotificationItems";
import {
    POST_VOTE_RECEIVED,
    COMMENT_MARKED,
    COMMENT_RECEIVED,
    COMMENT_VOTE_RECEIVED,
    MISSION_ACCOMPLISHED,
    REPLY_RECEIVED
} from "@/Enums/NotificationType"

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
                            case POST_VOTE_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <PostVoteReceived notification={n} />
                                </li>

                            case COMMENT_VOTE_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <CommentVoteReceived notification={n} />
                                </li>

                            case COMMENT_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <CommentReceived notification={n} />
                                </li>

                            case REPLY_RECEIVED:
                                return <li
                                    key={n.id}
                                >
                                    <ReplyReceived notification={n} />
                                </li>

                            case MISSION_ACCOMPLISHED:
                                return <li
                                    key={n.id}
                                >
                                    <MissionAccomplished notification={n} />
                                </li>

                            case COMMENT_MARKED:
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
