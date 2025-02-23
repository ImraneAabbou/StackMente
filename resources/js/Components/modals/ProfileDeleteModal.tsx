import Input from "@/Components/ui/Input";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Description, DialogTitle, Field, Label, DialogPanel } from "@headlessui/react";
import Trash from "@/Components/icons/Trash";
import Error from "../ui/Error";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormEvent } from "react";
import { router, useForm } from "@inertiajs/react";

interface ProfileDeleteModalProps extends Omit<BaseModalProps, "children" | "open"> {
    show: boolean
}

export default function ProfileDeleteModal({ onClose, show }: ProfileDeleteModalProps) {
    const { t } = useLaravelReactI18n()
    const { delete: destroy, data, setData, errors, reset } = useForm({
        password: ""
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        destroy(route("profile.destroy"), {
            onSuccess: () => {
                reset()
                onClose()
                router.visit(route("feed"))
            }
        })
    }

    return (
        <BaseModal open={show} onClose={onClose}>
            <div className="fixed inset-0 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center m-4 text-center items-center">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-background-light dark:bg-background-dark text-start shadow-xl w-full max-w-sm"
                    >
                        <form onSubmit={handleSubmit} className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col gap-4">
                            <div className="bg-background-light dark:bg-background-dark">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-error-light/25 dark:bg-error-dark/25 text-error-light dark:text-error-dark sm:mx-0 sm:size-10">
                                        <span aria-hidden="true" className="size text-error-light dark:text-error-dark">
                                            <Trash size={16} />
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-start w-full">
                                        <DialogTitle as="h3" className="text-base font-semibold">
                                            {t("delete_account.modal_title")}
                                        </DialogTitle>
                                        <p className="text-secondary text-xs">{t("delete_account.modal_desc")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-start flex flex-col gap-4">
                                <Field className="flex flex-col gap-1">
                                    <Label className="font-semibold text-sm">{t("delete_account.password_label")}</Label>
                                    <Description className="text-xs text-secondary">{t("delete_account.password_desc")}</Description>
                                    <div className="flex flex-col gap-1 grow">
                                        <Input
                                            type="password"
                                            onChange={(e) => setData("password", e.target.value)}
                                            value={data.password}
                                        />
                                        <Error className="ms-1">{errors.password}</Error>
                                    </div>
                                </Field>
                            </div>
                            <div className="sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-error-light dark:bg-error-dark hover:bg-error-light/80 hover:dark:bg-error-dark/80 text-onError-light dark:text-onError-dark px-3 py-2 text-sm font-semibold shadow-xs sm:ms-3 sm:w-auto"
                                >
                                    {t('content.delete_account')}
                                </button>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => onClose()}
                                    className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs sm:mt-0 sm:w-auto"
                                >
                                    {t('content.cancel')}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </BaseModal>
    );
}

