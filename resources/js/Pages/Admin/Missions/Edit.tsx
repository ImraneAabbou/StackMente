import Error from "@/Components/ui/Error";
import AdminLayout from "@/Layouts/AdminLayout";
import { Description, Field, Label } from "@headlessui/react";
import Input from "@/Components/ui/Input";
import { useForm, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { FormEvent, useRef } from "react";
import { MissionType } from "@/types/mission";
import {
    EMAIL_VERIFICATION,
    LINKING_WITH_PROVIDERS,
    PROFILE_SETUP,
    LOGIN_STREAK,
    LEVEL,
    XP_TOTAL,
    XP_DAILY,
    XP_WEEKLY,
    XP_MONTHLY,
    XP_YEARLY,
    TIMESPENT,
    TOTAL_OWNED_POSTS,
    TOTAL_OWNED_ARTICLES,
    TOTAL_OWNED_QUESTIONS,
    TOTAL_OWNED_SUBJECTS,
    TOTAL_MARKED_COMMENTS,
    TOTAL_MADE_COMMENTS,
    MADE_POSTS_VOTE_UPS,
    MADE_POSTS_VOTE_DOWNS,
    RECEIVED_POSTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_DOWNS,
    RECEIVED_COMMENTS_VOTE_UPS,
} from "@/Enums/MissionType";
import Select from "@/Components/ui/Select";
import { mission_image } from "@/Utils/helpers/path";

const MISSIONS_TYPES = [
    EMAIL_VERIFICATION,
    LINKING_WITH_PROVIDERS,
    PROFILE_SETUP,
    LOGIN_STREAK,
    LEVEL,
    XP_TOTAL,
    XP_DAILY,
    XP_WEEKLY,
    XP_MONTHLY,
    XP_YEARLY,
    TIMESPENT,
    TOTAL_OWNED_POSTS,
    TOTAL_OWNED_ARTICLES,
    TOTAL_OWNED_QUESTIONS,
    TOTAL_OWNED_SUBJECTS,
    TOTAL_MARKED_COMMENTS,
    TOTAL_MADE_COMMENTS,
    MADE_POSTS_VOTE_UPS,
    MADE_POSTS_VOTE_DOWNS,
    RECEIVED_POSTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_DOWNS,
    RECEIVED_COMMENTS_VOTE_UPS,
]

export default function AdminMissionsEdit() {
    const { t } = useLaravelReactI18n()
    const { mission } = usePage().props
    const { errors, post, reset, setData, data } = useForm(`FormCreate`, {
        ...mission,
        "_method": "put",
        'image': null as (null | File),
        'originalImage': mission.image,
    })
    const inputImageRef = useRef<HTMLInputElement | null>(null)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(route("missions.update", { mission: mission.id }), {
            onSuccess: () => {
                reset()
            }
        })
    }

    return <AdminLayout>
        <form onSubmit={handleSubmit} className="mt-16 flex flex-col gap-8 mx-auto max-w-xl">
            <Field className="flex flex-col gap-8 justify-between sm:max-w-lg">
                <div className="flex flex-col">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.mission_image_label")}</Label>
                    <Description className="text-xs text-secondary">{t("content.mission_image_desc")}</Description>
                    <Error className="mt-1">{errors.image}</Error>
                </div>
                <Input
                    ref={inputImageRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setData("image", (e.currentTarget.files!)[0])}
                />
                <img
                    onClick={() => inputImageRef.current?.click()}
                    className="size-48 mx-auto cursor-pointer"
                    src={
                        data.image
                            ? URL.createObjectURL(data.image)
                            : mission_image(data.originalImage)

                    }
                />
            </Field>
            <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                <div className="flex flex-col">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.mission_type_label")}</Label>
                    <Description className="text-xs text-secondary">{t("content.mission_type_desc")}</Description>
                </div>
                <div className="grow ">
                    <Select
                        className="w-full sm:max-w-sm"
                        type="number"
                        onChange={(e) => setData("type", e.target.value as MissionType)} value={data.type ?? ""}
                    >
                        <option value=""></option>
                        {
                            MISSIONS_TYPES.map(t => <option value={t}>{t}</option>)
                        }
                    </Select>
                    <Error className="ms-1">{errors.type}</Error>
                </div>
            </Field>
            <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                <div className="flex flex-col">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.translation_key_label")}</Label>
                    <Description className="text-xs text-secondary">{t("content.translation_key_desc")}</Description>
                </div>
                <div className="grow ">
                    <Input
                        className="w-full sm:max-w-sm"
                        type="text"
                        onChange={(e) => setData("translation_key", e.target.value)} value={data.translation_key}
                    />
                    <Error className="ms-1">{errors.translation_key}</Error>
                </div>
            </Field>
            <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                <div className="flex flex-col">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.threshold_label")}</Label>
                    <Description className="text-xs text-secondary">{t("content.threshold_desc")}</Description>
                </div>
                <div className="grow ">
                    <Input
                        className="w-full sm:max-w-sm"
                        type="number"
                        onChange={(e) => setData("threshold", e.target.valueAsNumber)} value={data.threshold}
                    />
                    <Error className="ms-1">{errors.threshold}</Error>
                </div>
            </Field>
            <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                <div className="flex flex-col">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.xp_reward_label")}</Label>
                    <Description className="text-xs text-secondary">{t("content.xp_reward_desc")}</Description>
                </div>
                <div className="grow ">
                    <Input
                        className="w-full sm:max-w-sm"
                        type="number"
                        onChange={(e) => setData("xp_reward", e.target.valueAsNumber)} value={data.xp_reward}
                    />
                    <Error className="ms-1">{errors.xp_reward}</Error>
                </div>
            </Field>
            <button
                className="flex self-end shrink-0 justify-center rounded-md bg-primary text-onPrimary px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
            >{t("content.update")}</button>
        </form>
    </AdminLayout>
}
