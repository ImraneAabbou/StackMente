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
import InfiniteScrollLoader from "@/Components/IntiniteScrollLoader";

export default function NotificationsIndex() {
    const { notifications: { items: notifications, next_page_url } } = usePage().props;
    const [lastNotificationTime, setLastNotificationTime] = useState(notifications[0]?.created_at)

    if (
        (!!notifications[0]) && (notifications[0].created_at != lastNotificationTime)
    ) {
        setLastNotificationTime(notifications[0].created_at)
        alert(`length changed`)
    }

    usePoll(2500, {
        only: ["notifications"],
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
        {

            next_page_url && <InfiniteScrollLoader url={next_page_url}>loading...</InfiniteScrollLoader>
        }
    </div>
}
