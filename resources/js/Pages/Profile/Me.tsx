import useFixedDateFormat from "@/Utils/hooks/useFixedDateFormat"
import { usePage } from "@inertiajs/react"
import { Mission } from "@/types/mission"
import { avatar, mission_image } from "@/Utils/helpers/path"
import { Duration } from "luxon"
import { useLaravelReactI18n } from "laravel-react-i18n"
import ProfileLayout from "@/Layouts/ProfileLayout"


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

    return <ProfileLayout>
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

                            {t("content.member_since", { date: fixedFormat(user.created_at) })}
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
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.global_rank")}</span> {user.stats.rank.total}</div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.timespent")}</span> <span className="italic">{formattedTimespent}</span></div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.current_streak")}</span> {user.stats.login.streak}</div>
                <div className="flex justify-between gap-4"><span className="font-bold text-secondary">{t("content.max_streak")}</span> {user.stats.login.max_streak}</div>
            </div>

        </div>

        <div className="mt-12">
            <div>
                <section>
                    <h2 className="font-bold text-2xl mb-4">{t("content.about")}</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus vero eaque fugiat recusandae nostrum officiis laboriosam earum, aliquam exercitationem dolorum dolore sapiente iste animi. Voluptatibus.</p>
                </section>

                <section className="my-8">
                    <h2 className="font-bold text-2xl mb-8">{t("content.achievements")}</h2>
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
    </ProfileLayout>
}


const AchievementItem = ({ mission: m }: { mission: Mission }) => {
    return <div className="flex flex-col gap-2 text-center">
        <img src={mission_image(m.image)} className="size-24 mx-auto" />
        <span className={`font-semibold text-xs`}>
            {m.title}
        </span>
    </div>
}
