import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import useRelativeDateFormat from "@/Utils/hooks/useRelativeDateFormat"
import { Link, useForm, usePage } from "@inertiajs/react"
import {
    QUESTION,
    ARTICLE,
    SUBJECT,
} from "@/Enums/PostType"
import { FormEvent } from "react"
import Layout from "@/Layouts/Layout"
import { Mission } from "@/types/mission"
import { mission_image } from "@/Utils/helpers/path"

export default function ProfileMe() {
    const { auth: { user }, missions } = usePage().props
    const relativeFormat = useRelativeDateFormat()
    const fixedFormat = useFixedDateFormat()
    const accomplishedMissionsIds = user.missions.map(m => m.id)
    const percentToNextLevel = (
        (user.stats.xp.total - user.stats.xp.curr_level_total)
        /
        (user.stats.xp.next_level_total - user.stats.xp.curr_level_total)
    ) * 100

    const questions = user.posts.filter(p => p.type === QUESTION)
    const articles = user.posts.filter(p => p.type === ARTICLE)
    const subjects = user.posts.filter(p => p.type === SUBJECT)


    return <Layout>
        <div className="flex flex-col gap-8 mb-12 mt-4">
            <div className="flex gap-4">

                <img src={`/images/users/${user.avatar}`} className="size-32 rounded-lg" />

                <div className="flex flex-col">
                    <div className="text-2xl font-bold">{user.fullname}</div>
                    <span className="text-xs text-secondary font-bold">
                        {user.username}
                    </span>
                    <span className="text-xs text-secondary">
                        <span className="">
                            Member since {fixedFormat(user.created_at)}
                        </span>
                    </span>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">
                            {user.stats.level}
                        </span>
                        <div className="rounded-full w-32 h-2 bg-secondary/25 relative overflow-hidden">
                            <span className="bg-success-light dark:bg-success-dark absolute inset-0 rounded" style={{ width: `${percentToNextLevel}%` }}></span>
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

            <section>
                <h2 className="font-bold text-2xl mb-4">About</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus vero eaque fugiat recusandae nostrum officiis laboriosam earum, aliquam exercitationem dolorum dolore sapiente iste animi. Voluptatibus.</p>
            </section>

            <section className="my-8">
                <h2 className="font-bold text-2xl mb-8">Achievements</h2>
                <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-24">
                    {
                        user.missions.map(m =>
                            <li key={m.id} className="basis-48">
                                <AchievementItem mission={m} />
                            </li>
                        )
                    }
                </ul>
            </section>

            <div className="grid grid-cols-3 gap-4">

                {

                    !!questions.length
                    && <div>
                        <h2 className="font-bold text-2xl mb-2.5">Questions</h2>
                        <ul className="flex flex-col gap-1">
                            {
                                questions.map(p =>
                                    <li key={p.id} className={``}>
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
                                    <li key={p.id} className={``}>
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
                                    <li key={p.id} className={``}>
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

            <DeleteAccountForm withPass={user.hasPassword} />

        </div>
    </Layout>
}


const DeleteAccountForm = ({ withPass }: { withPass: boolean }) => {
    const { errors, delete: destroy, data, setData } = useForm({
        password: ""
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        destroy("/profile")
    }

    return <form onSubmit={handleSubmit}>
        {

            withPass
            && <div>
                CurrentPassword: <input type="password" value={data.password} onChange={e => setData("password", e.target.value)} />
                {
                    errors.password &&
                    <span className="text-red-400">{errors.password}</span>
                }
            </div>
        }
        <div>
            <button className="bg-red-500 text-white" type="submit">Remove Account</button>
        </div>
    </form>
}

const AchievementItem = ({ mission: m }: { mission: Mission }) => {
    return <div className="flex flex-col gap-2 text-center">
        <img src={mission_image(m.image)} className="size-24 mx-auto" />
        <span className={`font-semibold text-xs`}>
            {m.title}
        </span>
    </div>
}
