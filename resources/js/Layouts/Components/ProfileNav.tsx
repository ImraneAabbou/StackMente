import { Link, type InertiaLinkProps } from "@inertiajs/react"
import clsx from "clsx"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function ProfileNav() {
    const { t } = useLaravelReactI18n()

    return <ul className="flex flex-col gap-4 flex-none md:sticky top-32 h-full">
        <li>
            <SideLink href={route("profile.me")} active={route().current("profile.me")}>{t("content.profile")}</SideLink>
        </li>
        <li>
            <SideLink href={"settings"}>{t("content.settings")}</SideLink>
        </li>
        <li>
            <SideLink
                href={route("profile.delete")}
                active={route().current("profile.delete")}
                className="!text-error-light dark:!text-error-dark"
            >
                {t("content.delete_account")}
            </SideLink>
        </li>
    </ul>
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
