import { Link, useForm } from "@inertiajs/react"
import { FormEvent } from "react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import AuthProviders from "./_Common/AuthProviders"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"


export default function Example() {
    const { t } = useLaravelReactI18n()
    const { post, errors, data, setData } = useForm(`RegisterForm`, {
        email: "",
        fullname: "",
        password: "",
        password_confirmation: "",
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(route("register"))
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-10 w-auto"
                    src="/favicon.ico"
                    alt="StackMente"
                />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
                    StackMente
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium leading-6">
                                {t("content.fullname")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="fullname"
                                    type="text"
                                    onChange={e => setData("fullname", e.target.value)}
                                    value={data.fullname}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Error className="ms-1">{errors.fullname}</Error>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6">
                                {t("content.email")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={e => setData("email", e.target.value)}
                                    value={data.email}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Error className="ms-1">{errors.email}</Error>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6">
                                {t("content.password")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="password"
                                    type="password"
                                    onChange={e => setData("password", e.target.value)}
                                    value={data.password}
                                    className="w-full"
                                    required
                                />
                                <Error className="ms-1">{errors.password}</Error>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6">
                                {t("content.password_confirmation")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    onChange={e => setData("password_confirmation", e.target.value)}
                                    value={data.password_confirmation}
                                    className="w-full"
                                    required
                                />
                                <Error className="ms-1">{errors.password_confirmation}</Error>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary text-onPrimary px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                            >
                                {t("content.register")}
                            </button>
                        </div>
                    </form>

                    <div>
                        <div className="relative mt-10">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-secondary/25" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-background-light dark:bg-background-dark px-2">{t("content.or")}</span>
                            </div>
                        </div>
                        <AuthProviders />
                    </div>
                </div>
                <p className="mt-10 text-center text-sm">
                    {t("content.already_registred")}{' '}
                    <Link href={route("login")} className="font-semibold leading-6">
                        {t("content.login")}
                    </Link>
                </p>
            </div>
        </div>
    )
}

