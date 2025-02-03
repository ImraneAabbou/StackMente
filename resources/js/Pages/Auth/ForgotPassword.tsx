import { useForm, usePage } from "@inertiajs/react"
import { FormEvent } from "react"
import { useLaravelReactI18n } from "laravel-react-i18n"
import Input from "@/Components/ui/Input"
import Error from "@/Components/ui/Error"
import Status from "@/Components/ui/Status"


export default function ForgotPassword() {
    const { status } = usePage().props
    const { t } = useLaravelReactI18n()
    const { post, errors, data, setData } = useForm(`ForgotPasswordForm`, {
        email: "",
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(route("password.email"))
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

                    <Status className="text-success-light dark:text-success-dark mb-8 w-full font-bold text-center block">
                        {status}
                    </Status>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6">
                                {t("content.email")}
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="email"
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
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue text-text-light px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                {t("common.send")}
                            </button>
                        </div>
                        <p className="text-gray">We will send you a link to the provided email that will let you reset your password to a new one.</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

