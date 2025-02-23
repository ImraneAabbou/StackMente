import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import { InertiaLinkProps, Link, useForm, usePage } from "@inertiajs/react"
import { FormEvent } from "react"
import { Mission } from "@/types/mission"
import { avatar, mission_image } from "@/Utils/helpers/path"
import Layout from "@/Layouts/Layout"
import clsx from "clsx"
import { Duration } from "luxon"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function ProfileMe() {
    const { auth: { user } } = usePage().props
    const fixedFormat = useFixedDateFormat()
    const percentToNextLevel = user.stats.xp.percent_to_next_level * 100
    const d = Duration.fromMillis(user.stats.timespent).shiftTo("hours", "minutes", "seconds", "days")
    const { t } = useLaravelReactI18n()
    const formattedTimespent = `
        ${d.days && Math.floor(d.days).toString().concat(t("content.d") as string) || ""}
        ${d.hours && Math.floor(d.hours).toString().concat(t("content.h") as string) || ""}
        ${d.minutes && Math.floor(d.minutes).toString().concat(t("content.m") as string) || ""}
        ${d.seconds && Math.floor(d.seconds).toString().concat(t("content.s") as string) || ""}
    `;

    return <Layout>
        <div className="flex md:flex-row-reverse flex-col gap-12 mb-12 mt-4">
            <ul className="flex flex-col gap-4 flex-none md:sticky top-32 h-full">
                <li>
                    <SideLink href={route("profile.me")} active={route().current("profile.me")}>Profile</SideLink>
                </li>
                <li>
                    <SideLink href={"posts"}>Posts</SideLink>
                </li>
                <li>
                    <SideLink href={"settings"}>Settings</SideLink>
                </li>
                <li>
                    <SideLink
                        href={route("profile.destroy")}
                        active={route().current("profile.destroy")}
                        className="!text-error-light dark:!text-error-dark"
                    >
                        Delete Account
                    </SideLink>
                </li>
            </ul>
            <div>
                <div className="flex gap-8 lg:flex-row flex-col">
                    <div className="flex gap-4  flex-col items-center md:items-start text-center md:text-start md:flex-row">
                        <img src={avatar(user.avatar)} className="size-32 rounded-lg" />

                        <div className="flex flex-col">
                            <div className="text-xl font-bold">{user.fullname}</div>
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
                    </div>

                    <div className="flex flex-col w-64 mx-auto lg:mx-0 lg:ms-auto rounded-lg border-secondary/25 border-2 p-4">
                        <div className="flex justify-between gap-4"><span className="font-bold text-secondary">Global rank</span> {user.stats.rank.total}</div>
                        <div className="flex justify-between gap-4"><span className="font-bold text-secondary">Timespent</span> <span className="italic">{formattedTimespent}</span></div>
                        <div className="flex justify-between gap-4"><span className="font-bold text-secondary">Current streak</span> {user.stats.login.streak}</div>
                        <div className="flex justify-between gap-4"><span className="font-bold text-secondary">Max streak</span> {user.stats.login.max_streak}</div>
                    </div>

                </div>

                <div className="mt-12">
                    <div>
                        <section>
                            <h2 className="font-bold text-2xl mb-4">About</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus vero eaque fugiat recusandae nostrum officiis laboriosam earum, aliquam exercitationem dolorum dolore sapiente iste animi. Voluptatibus.</p>
                        </section>

                        <section className="my-8">
                            <h2 className="font-bold text-2xl mb-8">Achievements</h2>
                            <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-24">
                                {
                                    user.missions.map(m =>
                                        <li key={m.id} className="basis-48">
                                            <AchievementItem mission={m} />
                                        </li>
                                    )
                                }
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
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

const SideLink = ({ className = "", active = false, ...props }: InertiaLinkProps & { active?: boolean }) => {
    return <Link
        {...props}
        className={
            clsx(
                "px-4 py-2 text-sm border-s-4",
                active
                    ? "font-semibold text-current border-current px-4"
                    : "text-secondary hover:text-current text-2xs border-transparent",
                className
            )
        }
    />
}
