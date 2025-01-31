import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import { Link, usePage } from "@inertiajs/react"
import {
    QUESTION,
    ARTICLE,
    SUBJECT,
} from "@/Enums/PostType"

export default function ProfileMe() {
    const { auth: { user }, missions } = usePage().props
    const joinedAt = useRelativeDateFormat(user.created_at)
    const joinningDate = useFixedDateFormat(user.created_at)
    const accomplishedMissionsIds = user.missions.map(m => m.id)
    const percentToNextLevel = (
        (user.stats.xp.total - user.stats.xp.curr_level_total)
        /
        (user.stats.xp.next_level_total - user.stats.xp.curr_level_total)
    ) * 100

    const questions = user.posts.filter(p => p.type === QUESTION)
    const articles = user.posts.filter(p => p.type === ARTICLE)
    const subjects = user.posts.filter(p => p.type === SUBJECT)

    console.log(user)

    return <div className="p-4 container">
        <div className="flex gap-4 mb-5">

            <img src={`/images/users/${user.avatar}`} className="size-32 rounded-lg" />

            <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-2.5">{user.fullname}</h1>

                <small className="text-gray-900 font-bold">
                    @{user.username}
                </small>
                <small>
                    <span className="font-bold">Joined :
                    </span> {joinningDate} <span className="text-gray-500">({joinedAt})</span>
                </small>
                <div className="flex gap-4 items-center">
                    <span className="font-bold">
                        {user.stats.level}
                    </span>
                    <div className="rounded-full w-32 h-2 bg-gray-200 relative overflow-hidden">
                        <span className="bg-green-500 absolute inset-0 rounded" style={{ width: `${percentToNextLevel}%` }}></span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col ms-auto">
                <div className="flex justify-between gap-2"><span className="font-bold">Ranked</span> {user.stats.rank.total}</div>
                <div className="flex justify-between gap-2"><span className="font-bold">Timespent:</span> {user.stats.timespent}</div>
                <div className="flex justify-between gap-2"><span className="font-bold">Current streak:</span> {user.stats.login.streak}</div>
                <div className="flex justify-between gap-2"><span className="font-bold">Max streak:</span> {user.stats.login.max_streak}</div>
            </div>

        </div>

        <div>
            <h2 className="font-bold text-2xl mb-2.5">Missions</h2>
            <ul className="flex flex-col gap-1">
                {
                    missions.map(m =>
                        <li key={m.id} className={`text-gray-600`}>
                            <span className={`font-bold ${accomplishedMissionsIds.includes(m.id) ? "text-green-500" : ""}`}>
                                {m.title}:
                            </span> {m.description}
                        </li>
                    )
                }
            </ul>
        </div>

        <div className="grid grid-cols-3 gap-4">

            {

                !!questions.length
                && <div>
                    <h2 className="font-bold text-2xl mb-2.5">Questions</h2>
                    <ul className="flex flex-col gap-1">
                        {
                            questions.map(p =>
                                <li key={p.id} className={`text-gray-600`}>
                                    <Link href={`/posts/${p.slug}`}>
                                        <span className={`font-bold`}>
                                            {p.title}:
                                        </span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                </div>
            }
            {

                !!subjects.length
                && <div>
                    <h2 className="font-bold text-2xl mb-2.5">Subjects</h2>
                    <ul className="flex flex-col gap-1">
                        {
                            subjects.map(p =>
                                <li key={p.id} className={`text-gray-600`}>
                                    <Link href={`/posts/${p.slug}`}>
                                        <span className={`font-bold`}>
                                            {p.title}:
                                        </span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                </div>
            }

            {

                !!articles.length
                && <div>
                    <h2 className="font-bold text-2xl mb-2.5">Articles</h2>
                    <ul className="flex flex-col gap-1">
                        {
                            articles.map(p =>
                                <li key={p.id} className={`text-gray-600`}>
                                    <Link href={`/posts/${p.slug}`}>
                                        <span className={`font-bold`}>
                                            {p.title}:
                                        </span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                </div>
            }
        </div>

    </div>
}
