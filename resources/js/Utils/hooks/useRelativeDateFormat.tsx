import { useLaravelReactI18n } from "laravel-react-i18n"

export default function useRelativeDateFormat() {

    const { currentLocale } = useLaravelReactI18n()

    return (d: string | Date) => {

        const date = d instanceof Date ? d : new Date(d)
        const diffInSec = (date.getTime() - Date.now()) / 1000
        const absDiffInSec = Math.abs(diffInSec)
        const locale = currentLocale()
        let div: number,
            unit: Intl.RelativeTimeFormatUnit

        if (absDiffInSec < 60) {
            div = 1
            unit = "seconds"
        }
        else if (absDiffInSec < 3600) {
            div = 60
            unit = "minutes"
        }
        else if (absDiffInSec < 86400) {
            div = 3600
            unit = "hours"
        }
        else if (absDiffInSec < 604800) {
            div = 86400
            unit = "days"
        }
        else if (absDiffInSec < 2592000) {
            div = 604800
            unit = "weeks"
        }
        else if (absDiffInSec < 31104000) {
            div = 2592000
            unit = "months"
        }
        else {
            div = 2592000
            unit = "years"
        }

        return new Intl.RelativeTimeFormat(
            locale,
            { numeric: "auto" }
        ).format(
            Math.round(diffInSec / div),
            unit
        )

    }
}
