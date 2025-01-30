import { PostType } from "@/types/post"
import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import { Link, usePage } from "@inertiajs/react"

export default function ProfileShow() {
    const { user } = usePage().props
    const joinedAt = useRelativeDateFormat(user.created_at)
    const joinningDate = useFixedDateFormat(user.created_at)

    const questions = user.posts.filter(p => p.type === PostType.QUESTION)
    const articles = user.posts.filter(p => p.type === PostType.ARTICLE)
    const subjects = user.posts.filter(p => p.type === PostType.SUBJECT)

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
                <div className="font-bold">
                        {user.stats.level}
                </div>
            </div>

            <div className="flex flex-col ms-auto">
                <div className="flex justify-between gap-2"><span className="font-bold">Timespent:</span> {user.stats.timespent}</div>
                <div className="flex justify-between gap-2"><span className="font-bold">Current streak:</span> {user.stats.login.streak}</div>
                <div className="flex justify-between gap-2"><span className="font-bold">Max streak:</span> {user.stats.login.max_streak}</div>
            </div>

        </div>

        <div>
            <h2 className="font-bold text-2xl mb-2.5">Missions</h2>
            <ul className="flex flex-col gap-1">
                {
                    user.missions.map(m =>
                        <li key={m.id} className={`text-gray-600`}>
                            <span className={`font-bold text-green-500`}>
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
