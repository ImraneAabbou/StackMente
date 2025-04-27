import Input from "@/Components/ui/Input"
import { useForm } from "@inertiajs/react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { FormEvent } from "react"

export default function SearchInput() {
    const { t } = useLaravelReactI18n()
    const { setData, data, get } = useForm({
        q: route().queryParams.q as string
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        get(route(route().current() as string, { q: data.q }))
    }

    return <form className="flex justify-end ms-auto gap-2 grow max-w-sm" onSubmit={handleSubmit}>
        <Input
            type="search"
            className="w-full"
            placeholder={t("reports.search_placeholder") as string}
            onChange={e => setData("q", e.target.value)}
            value={data.q}
        />
    </form>
}
