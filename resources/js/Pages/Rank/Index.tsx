import Layout from "@/Layouts/Layout";
import { avatar } from "@/Utils/helpers/path";
import { Link, usePage } from "@inertiajs/react";
import clsx from "clsx";
import { useLaravelReactI18n } from "laravel-react-i18n";
import Medal from "@/Components/icons/Medal";
import { FormattedNumber } from "react-intl";
import { DAILY, WEEKLY, MONTHLY, YEARLY, TOTAL } from "@/Enums/Period"
import { Period } from "@/types/period"

export default function RankIndex() {
    const { rankings: { users }, auth: { user } } = usePage().props;
    const { t } = useLaravelReactI18n();
    let { season } = route().params

    // check season query validity
    season = [DAILY, WEEKLY, MONTHLY, YEARLY, TOTAL].includes(season?.toUpperCase())
    ? season.toUpperCase()
    : DAILY


    const rankColors = [
        "text-yellow-500 dark:text-yellow-400",
        "text-gray-400 dark:text-gray-300",
        "text-orange-500 dark:text-orange-400"
    ];

    return (
        <Layout>
            <div className="flex flex-col gap-8 mb-12">
                <div className="mt-2">
                    <div className="flex justify-between items-center flex-wrap">
                        <h1 className="text-2xl font-display leading-loose tracking-wider">{t("content.ranking")}</h1>
                        <div>
                            <div className="flex gap-1 self-end">
                                {
                                    [DAILY, WEEKLY, MONTHLY, YEARLY, TOTAL].map(
                                        s => <Link
                                            href={
                                                route(
                                                    route().current() as string,
                                                    { _query: { season: s } }
                                                )
                                            }
                                            className={
                                                clsx(
                                                    "text-xs px-2 py-0.5 rounded-full",
                                                    season === s
                                                        ? "bg-secondary/50"
                                                        : "hover:bg-secondary/25"
                                                )
                                            }
                                        >
                                            {t("seasons." + s)}
                                        </Link>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <p className="text-secondary text-sm">
                        {t("ranking.ranking_definition")}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse container max-w-2xl">
                        <thead className="font-bold text-secondary">
                            <tr className="text-sm">
                                <th className="p-3">{t("content.rank")}</th>
                                <th className="p-3">{t("content.user")}</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {
                                [
                                    ...users,
                                    user &&
                                    !users.find(u => u.id === user?.id)
                                    && {
                                        ...user,
                                        rank: user.stats.rank[season.toLowerCase() as Lowercase<Period>]
                                    }
                                ]
                                    .filter(u => !!u)
                                    .map((u) => (
                                        <tr
                                            key={u.id}
                                            className={clsx(
                                                "border-b last:border-b-0 border-secondary/25 hover:bg-secondary/25",
                                                (user?.id === u.id && u.rank >= 3) && "bg-secondary/25",
                                                (user?.id === u.id || (u.rank <= 3)) && "font-bold" || "text-sm",
                                            )}
                                        >
                                            <td className="p-3 text-center">
                                                {
                                                    u.rank <= 3 ? (
                                                        <span className={clsx("inline-block mx-auto", rankColors[u.rank - 1])}>
                                                            <Medal />
                                                        </span>
                                                    ) : (
                                                        <span>{u.rank}</span>
                                                    )
                                                }
                                            </td>
                                            <td className="p-3 flex items-center gap-3">
                                                <Link
                                                    href={
                                                        u.id === user?.id
                                                            ? route("profile.index")
                                                            : route("profile.show", { username: u.username })
                                                    }
                                                    className="flex items-center gap-3"
                                                >
                                                    <img
                                                        className="w-10 h-10 object-cover rounded-full border border-secondary dark:border-secondary/50"
                                                        src={avatar(u.avatar)}
                                                        alt="Avatar"
                                                    />
                                                    <span>{u.id === user?.id ? t("common.you") : u.fullname}</span>
                                                </Link>
                                            </td>
                                            <td className="p-3 text-right" title={`${u.stats.xp[season.toLowerCase() as Lowercase<Period>]} XP`}>

                                                <FormattedNumber value={u.stats.xp[season.toLowerCase() as Lowercase<Period>]} style="decimal" notation="compact" />
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

