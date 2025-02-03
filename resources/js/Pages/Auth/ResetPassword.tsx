import { useForm, usePage } from "@inertiajs/react"
import { FormEvent } from "react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"
import Status from "@/Components/ui/Status"


export default function ForgotPassword({ token, email }: { token: string, email: string }) {
    const { status } = usePage().props
    const { t } = useLaravelReactI18n()
    const { put, errors, data, setData } = useForm(`ForgotPasswordForm`, {
        token,
        email,
        password: "",
        password_confirmation: "",
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        put(route("password.store"))
    }

    console.log(errors)

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

                    <Status className="text-success-light dark:text-success-dark mb-8 w-full font-bold text-center block">
                        {status}
                    </Status>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium leading-6">
                                {t("content.new_password")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="new_password"
                                    type="password"
                                    onChange={e => setData("password", e.target.value)}
                                    value={data.password}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Error className="ms-1">{errors.password}</Error>
                        </div>

                        <div>
                            <label htmlFor="new_password_confirmation" className="block text-sm font-medium leading-6">
                                {t("content.new_password_confirmation")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="new_password_confirmation"
                                    type="password"
                                    onChange={e => setData("password_confirmation", e.target.value)}
                                    value={data.password_confirmation}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Error className="ms-1">{errors.password_confirmation}</Error>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue text-text-light px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                {t("common.reset")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

