import { useLaravelReactI18n } from "laravel-react-i18n"

export default function useFixedDateFormat(withTime = false) {
    const { currentLocale } = useLaravelReactI18n()

    return (d: string | Date) => {
        const date = d instanceof Date ? d : new Date(d)
        const locale = currentLocale()
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: withTime ? "numeric" : undefined,
            minute: withTime ? "numeric" : undefined,
        }
        return new Intl.DateTimeFormat(
            locale,
            options
        ).format(date)
    }
}
