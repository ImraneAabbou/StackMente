import { usePage } from "@inertiajs/react"
import clsx from "clsx"
import { useLaravelReactI18n } from "laravel-react-i18n"

export default function Status({ className = "" }) {
    const { status } = usePage().props
    const { t } = useLaravelReactI18n()

    return status && <span className={clsx("text-sm", className)}>{t(`status.${status}`)}</span>
}
