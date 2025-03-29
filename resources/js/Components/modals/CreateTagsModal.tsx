import BaseModal, { BaseModalProps } from "./BaseModal";
import { DialogTitle, DialogPanel, Field, Label } from "@headlessui/react";
import Input from "../ui/Input";
import { useLaravelReactI18n } from "laravel-react-i18n";
import Tags from "../icons/Tags";
import { Tag } from "@/types/tag";
import Error from "../ui/Error";
import { uniqBy } from "lodash";

interface CreateTagsModalProps extends Omit<BaseModalProps, "children" | "open"> {
    errorTags?: string[]
    errors: Record<string, any>
    tags: Omit<Tag, "created_at" | "id">[]
    setTags: (tags: Omit<Tag, "created_at" | "id">[]) => any
}

export default function CreateTagsModal({ errorTags, tags, setTags, errors, onClose }: CreateTagsModalProps) {
    const { t } = useLaravelReactI18n()

    return (
        <BaseModal
            open={!!errorTags?.length || Object.keys(errors).some(e => e.startsWith("tags."))}
            onClose={onClose}
        >
            <div className="fixed inset-0 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center m-4 text-center items-center">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-background-light dark:bg-background-dark text-start shadow-xl w-full max-w-lg"
                    >
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col gap-4">
                            <div className="bg-background-light dark:bg-background-dark">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary/25 dark:bg-secondary/25  sm:mx-0 sm:size-10">
                                        <span aria-hidden="true">
                                            <Tags size={16} />
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-start w-full">
                                        <DialogTitle as="h3" className="text-base font-semibold">
                                            {t("content.create_tags_modal_title")}
                                        </DialogTitle>
                                        <p className="text-secondary text-xs">{t("content.create_tags_modal_desc")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">

                                {
                                    errorTags?.map(
                                        (errTag, i) => <div className="text-start flex flex-col gap-4">
                                            <Field className="flex flex-col gap-1">
                                                <Label className="font-semibold text-sm">{errTag}</Label>
                                                <div className="flex flex-col gap-1 grow">
                                                    <Input
                                                        value={(tags.find(x => x.name == errTag))?.description}
                                                        onChange={(e) => setTags(
                                                            uniqBy([
                                                                ...tags,
                                                                { "name": errTag, "description": e.target.value }
                                                            ].toReversed(), "name").toSorted()
                                                        )}
                                                    />
                                                </div>
                                                <Error>{errors[`tags.${errTag}.description`]}</Error>
                                            </Field>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    onClick={onClose}
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-primary hover:bg-primary/90 text-onPrimary px-3 py-2 text-sm font-semibold shadow-xs sm:ms-3 sm:w-auto"
                                >
                                    {t('content.done')}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </BaseModal>
    );
}

