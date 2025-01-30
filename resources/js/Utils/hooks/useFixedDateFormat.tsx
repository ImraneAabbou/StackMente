import { useLaravelReactI18n } from "laravel-react-i18n"

export default function useFixedDateFormat(d: string | Date, withTime = false): string {
    const { currentLocale } = useLaravelReactI18n()
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
