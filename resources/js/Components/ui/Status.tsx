import { usePage } from "@inertiajs/react"
import clsx from "clsx"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { ReactNode } from "react"

export default function Status({ children, className = "" }: { children?: string, className?: string }) {
    const { status } = usePage().props
    const { t } = useLaravelReactI18n()

    return status && <span className={clsx("text-sm", className)}>
        {
            children
                ? t(children)
                : t(`status.${status}`)
        }
    </span>
}
