import { router } from "@inertiajs/react";
import Select from "./ui/Select";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { InputHTMLAttributes } from "react";

export default function LangSelect(props: InputHTMLAttributes<HTMLSelectElement>) {
    const { getLocales, currentLocale, t, setLocale } = useLaravelReactI18n()
    const handleChange = (l: string) => {
        router.post(route("lang.store", { lang: l }), {}, {
            preserveState: "errors",
            preserveScroll: true,
            onSuccess: () => location.reload()
        })
    }

    return <Select value={currentLocale()} onChange={e => handleChange(e.target.value)} {...props}>
        {
            getLocales().map(l => <option key={l} value={l}>{t(`lang.${l}`)}</option>)
        }
    </Select>
}
