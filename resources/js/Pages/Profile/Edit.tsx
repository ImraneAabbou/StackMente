import ProfileLayout from "@/Layouts/ProfileLayout"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { Field, Label } from "@headlessui/react"
import Error from "@/Components/ui/Error"
import Input from "@/Components/ui/Input"
import { useForm, usePage } from "@inertiajs/react"
import { avatar } from "@/Utils/helpers/path"
import Editor from "@/Components/ui/Editor"
import { FormEvent, FormHTMLAttributes, ReactNode, useRef } from "react"
import Quill from "quill"
import { ToolbarConfig } from "quill/modules/toolbar"
import clsx from "clsx"
import { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import PhotoCropModal from "@/Components/modals/PhotoCropModal"


const BIO_TOOLBAR: ToolbarConfig = [

    ['bold', 'italic', 'underline', 'strike'],

    ['link'],
]

export default function ProfileMe() {
    return <ProfileLayout>
        <div>
            <AccountInformationsForm />
        </div>
    </ProfileLayout>
}

const PasswordAndSecurityForm = () => {
    const { t } = useLaravelReactI18n()
    return <RoundedForm title={t("settings.password_and_security") as string}>hi</RoundedForm>
}

const AccountInformationsForm = () => {
    const { t } = useLaravelReactI18n()
    const user = usePage().props.auth.user
    const [imageToCrop, setImageToCrop] = useState<null | File>(null);
    const { data, setData, errors, post, recentlySuccessful } = useForm({
        _method: "PUT",
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
        current_password: "",
        password_confirmation: "",
        avatar: null as File | null
    })
    const editorRef = useRef<Quill | null>(null)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(route("profile.update"))
    }

    return <RoundedForm onSubmit={handleSubmit} title={t("settings.account_informations") as string} className="mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
            <div>
                <Field className="flex flex-col gap-4 justify-between max-w-md">
                    <div className="flex flex-col">
                        <Label className="shrink-0 font-semibold">{t("settings.profile_picture")}</Label>
                        <Error>{errors.avatar}</Error>
                    </div>
                    <div className="relative rounded-lg overflow-hidden mx-auto lg:mx-0 max-w-48 min-w-24">
                        <input
                            onChange={
                                e => isImgSquareRatio((e.target.files!)[0])
                                    .then(
                                        r => r ? setData("avatar", (e.target.files!)[0])
                                            : setImageToCrop((e.target.files!)[0])
                                    )
                            }
                            type="file"
                            className="absolute size-full opacity-0 cursor-pointer"
                        />
                        <img
                            src={
                                data.avatar === null || typeof data.avatar === "string"
                                    ? avatar(user.avatar)
                                    : URL.createObjectURL(data.avatar)
                            }
                            className="w-full"
                        />
                        <div className="bg-black text-white w-full text-xs text-center px-1 py-2">{t("settings.click_to_change_picture")}</div>
                    </div>
                </Field>
            </div>
            <div className="grow shrink-0 flex flex-col gap-4">
                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.fullname")}</Label>
                    <div className="grow ">
                        <Input
                            className="w-full sm:max-w-sm"
                            type="text"
                            onChange={(e) => setData("fullname", e.target.value)} value={data.fullname}
                        />
                        <Error className="ms-1">{errors.fullname}</Error>
                    </div>
                </Field>
                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.username")}</Label>
                    <div className="grow ">
                        <Input
                            className="w-full sm:max-w-sm"
                            type="text"
                            onChange={(e) => setData("username", e.target.value)} value={data.username}
                        />
                        <Error className="ms-1">{errors.username}</Error>
                    </div>
                </Field>
                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.email")}</Label>
                    <div className="grow">
                        <Input
                            className="w-full sm:max-w-sm"
                            type="text"
                            onChange={(e) => setData("email", e.target.value)} value={data.email}
                        />
                        <Error className="ms-1">{errors.email}</Error>
                    </div>
                </Field>

                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.bio")}</Label>
                    <Editor
                        defaultValue={data.bio}
                        ref={editorRef}
                        onChange={() =>
                            setData(
                                "bio",
                                editorRef.current?.getSemanticHTML() as string
                            )
                        }
                        toolbar={BIO_TOOLBAR}
                        placeholder={"..."}
                        className="border rounded border-secondary/25 py-4 container"
                    />
                </Field>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:max-w-lg">
                    {
                        recentlySuccessful && <p className="text-success-light dark:text-success-dark text-sm">{t("settings.updated_successfully")}</p>
                    }
                    <button
                        type="submit"
                        className="flex w-full ms-auto sm:w-auto justify-center rounded-md bg-primary text-onPrimary mt-4 px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                    >
                        {t("content.update")}
                    </button>
                </div>
            </div>
        </div>
        {
            imageToCrop
            && <PhotoCropModal
                file={imageToCrop}
                onClose={() => setImageToCrop(null)}
                onCrop={(croppedImage) => setData("avatar", croppedImage)}
            />
        }
    </RoundedForm>
}

interface RoundedFormProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string
    title?: string
    children: ReactNode
}

const RoundedForm = ({ className, title, children, ...props }: RoundedFormProps) => {
    return <form className={clsx("border rounded-md border-secondary/25 p-4 relative pt-12", className)} {...props}>
        <h2 className="text-lg sm:text-xl absolute -top-4 bg-background-light dark:bg-background-dark px-2">{title}</h2>
        {children}
    </form>
}


const isImgSquareRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            resolve(img.width === img.height);
        };

        img.onerror = () => resolve(false);
    });
};
