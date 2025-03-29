import Select from "../ui/Select";
import Textarea from "@/Components/ui/Textarea";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Description, DialogTitle, Field, Label, DialogPanel } from "@headlessui/react";
import Flag from "@/Components/icons/Flag";
import Error from "../ui/Error";
import {
    FALSE_INFORMATION,
    SPAM_OR_SCAM,
    CHEATING,
    INAPPROPRIATE_CONTENT,
    OFFENSIVE_LANGUAGE,
    OTHER,
} from "@/Enums/ReportReason"
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";

interface ReportModalProps extends Omit<BaseModalProps, "children" | "open"> {
    reportAction: string | null
}

export default function ReportModal({ onClose, reportAction }: ReportModalProps) {
    const { t } = useLaravelReactI18n()
    const { post, data, setData, errors, reset } = useForm(reportAction ?? `reportForm`, {
        reason: "",
        explanation: "",
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(reportAction as string, {
            onSuccess: () => {
                reset()
                onClose()
            }
        })
    }
    return (
        <BaseModal open={!!reportAction} onClose={onClose}>
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
                                            <Flag size={16} />
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-start w-full">
                                        <DialogTitle as="h3" className="text-base font-semibold">
                                            {t("reports.modal_title")}
                                        </DialogTitle>
                                        <p className="text-secondary text-xs">{t("reports.modal_desc")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-start flex flex-col gap-4">
                                <Field className="flex flex-col gap-1">
                                    <Label className="font-semibold text-sm">{t("reports.reason")}</Label>
                                    <div className="flex flex-col gap-1 grow">
                                        <Select className="w-full" onChange={(e) => setData("reason", e.target.value)} value={data.reason}>
                                            <option value=""></option>
                                            <option value={CHEATING}>{t("reports." + CHEATING)}</option>
                                            <option value={FALSE_INFORMATION}>{t("reports." + FALSE_INFORMATION)}</option>
                                            <option value={SPAM_OR_SCAM}>{t("reports." + SPAM_OR_SCAM)}</option>
                                            <option value={OFFENSIVE_LANGUAGE}>{t("reports." + OFFENSIVE_LANGUAGE)}</option>
                                            <option value={INAPPROPRIATE_CONTENT}>{t("reports." + INAPPROPRIATE_CONTENT)}</option>
                                            <option value={OTHER}>{t("reports." + OTHER)}</option>
                                        </Select>
                                        <Error className="ms-1">{errors.reason}</Error>
                                    </div>
                                </Field>
                                <Field className="flex flex-col gap-1">
                                    <Label className="font-semibold text-sm">{t("reports.explanation")}</Label>
                                    <Description className="text-xs text-secondary">{t("reports.explanation_desc")}</Description>
                                    <div className="flex flex-col gap-1 grow">
                                        <Textarea className="resize-none h-24" onChange={(e) => setData("explanation", e.target.value)} value={data.explanation} />
                                        <Error className="ms-1">{errors.explanation}</Error>
                                    </div>
                                </Field>
                            </div>
                            <div className="sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-error-light dark:bg-error-dark hover:bg-error-light/80 hover:dark:bg-error-dark/80 text-onError-light dark:text-onError-dark px-3 py-2 text-sm font-semibold shadow-xs sm:ms-3 sm:w-auto"
                                >
                                    {t('content.report')}
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

