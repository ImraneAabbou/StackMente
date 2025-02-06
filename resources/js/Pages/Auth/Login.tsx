import { Link, useForm, usePage } from "@inertiajs/react"
import { FormEvent } from "react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import AuthProviders from "./_Common/AuthProviders"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"
import Status from "@/Components/ui/Status"


export default function Login() {
    const { status } = usePage().props
    const { t } = useLaravelReactI18n()
    const { post, errors, data, setData } = useForm(`LoginForm`, {
        login: "",
        password: "",
        remember: false,
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(route("login"))
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

                    <Status
                        className="text-success-light dark:text-success-dark mb-8 w-full font-bold text-center block"
                    >
                        {status}
                    </Status>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium leading-6">
                                {t("content.email_username")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="login"
                                    autoComplete="email"
                                    onChange={e => setData("login", e.target.value)}
                                    value={data.login}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Error className="ms-1">{errors.login}</Error>
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6">
                                    {t('content.remember_me')}
                                </label>
                            </div>

                            <div className="text-sm text-secondary leading-6">
                                <Link href={route("password.request")} className="font-semibold">
                                    {t('content.forgot_password')}
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary text-onPrimary px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                            >
                                {t("content.login")}
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
                    {t("content.not_a_member")}{' '}
                    <Link href={route("register")} className="font-semibold leading-6">
                        {t("content.register")}
                    </Link>
                </p>
            </div>
        </div>
    )
}

