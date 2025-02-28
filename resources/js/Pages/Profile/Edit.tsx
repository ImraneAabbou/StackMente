import ProfileLayout from "@/Layouts/ProfileLayout"
import { useLaravelReactI18n } from "laravel-react-i18n"
import { Field, Label } from "@headlessui/react"
import Error from "@/Components/ui/Error"
import Input from "@/Components/ui/Input"
import { Link, useForm, usePage } from "@inertiajs/react"
import { avatar } from "@/Utils/helpers/path"
import Editor from "@/Components/ui/Editor"
import { FormEvent, FormHTMLAttributes, ReactNode, useRef } from "react"
import Quill from "quill"
import { ToolbarConfig } from "quill/modules/toolbar"
import clsx from "clsx"
import { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import PhotoCropModal from "@/Components/modals/PhotoCropModal"
import Verified from "@/Components/icons/Verified"
import Unverified from "@/Components/icons/Unvefied"
import Status from "@/Components/ui/Status"
import Google from "@/Components/icons/Google"
import Facebook from "@/Components/icons/Facebook"
import Github from "@/Components/icons/Github"

type Provider = {
    name: string,
    icon: ReactNode
}

const providers: Provider[] = [
    {
        name: "Google",
        icon: <Google />
    },
    {
        name: "Facebook",
        icon: <Facebook />
    },
    {
        name: "Github",
        icon: <Github />
    },
];


const BIO_TOOLBAR: ToolbarConfig = [

    ['bold', 'italic', 'underline', 'strike'],

    ['link'],
]

export default function ProfileMe() {
    return <ProfileLayout>
        <div className="flex flex-col gap-12 my-6">
            <AccountInformationsForm />
            <PasswordAndSecurityForm />
            <LinkedAccountsForm />
        </div>
    </ProfileLayout>
}

const PasswordAndSecurityForm = () => {
    const { t } = useLaravelReactI18n()
    const { auth: { user }, status } = usePage().props
    const { setData, data, errors, put, recentlySuccessful, reset } = useForm({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
        current_password: "",
        password_confirmation: "",
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        put(route("profile.update"), {
            onSuccess: () => {
                reset()
            }
        })
    }

    return <RoundedForm onSubmit={handleSubmit} title={t("settings.password_and_security") as string}>
        <div className="flex gap-12 flex-col lg:flex-row">
            <div className="flex flex-col gap-4 grow max-w-xl">
                {user.hasPassword &&
                    <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                        <Label className="shrink-0 font-semibold mt-1 min-w-24">
                            {
                                t("content.current_password")
                            }
                        </Label>
                        <div className="grow">
                            <Input
                                className="w-full sm:max-w-sm"
                                type="password"
                                onChange={(e) => setData("current_password", e.target.value)} value={data.current_password}
                            />
                            <Error className="ms-1">{errors.current_password}</Error>
                        </div>
                    </Field>
                }
                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.new_password")}</Label>
                    <div className="grow">
                        <Input
                            className="w-full sm:max-w-sm"
                            type="password"
                            onChange={(e) => setData("password", e.target.value)} value={data.password}
                        />
                        <Error className="ms-1">{errors.password}</Error>
                    </div>
                </Field>
                <Field className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between sm:max-w-lg">
                    <Label className="shrink-0 font-semibold mt-1 min-w-24">{t("content.confirmation")}</Label>
                    <div className="grow">
                        <Input
                            className="w-full sm:max-w-sm"
                            type="password"
                            onChange={(e) => setData("password_confirmation", e.target.value)} value={data.password_confirmation}
                        />
                        <Error className="ms-1">{errors.password_confirmation}</Error>
                    </div>
                </Field>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:max-w-lg">
                    {
                        recentlySuccessful && <p className="text-success-light dark:text-success-dark text-sm">{t("settings.updated_successfully")}</p>
                    }
                    <button
                        type="submit"
                        className="flex w-full ms-auto sm:w-auto justify-center rounded-md bg-primary text-onPrimary px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                    >
                        {t("content.update")}
                    </button>
                </div>
            </div>
            {
                user.email_verified_at
                    ? <div className="min-h-32 grow flex flex-col gap-2 justify-center items-center text-success-light dark:text-success-dark font-semibold">
                        <Verified size={48} />
                        <p>
                            {t("settings.email_verified_title")}
                        </p>
                    </div>
                    : <div className="min-h-32 grow flex flex-col gap-2 justify-center items-center">
                        <Unverified size={48} />
                        <p className="font-semibold">
                            {t("settings.email_unverified_title")}
                        </p>
                        <p className="text-secondary text-xs max-w-xs text-center">
                            {t("settings.email_unverified_desc")}
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            preserveScroll
                            className="flex justify-center rounded-md bg-primary text-onPrimary mt-4 px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                        >
                            {t("settings.verify")}
                        </Link>
                        <Status className="text-success-light dark:text-success-dark text-center mt-4 font-bold">{status}</Status>

                    </div>
            }
        </div>
    </RoundedForm>
}


const isAlreadyLinked = (p: string) => {
    const providers = usePage().props.auth.user.providers
    return Object.keys(providers).map(p => p.toLowerCase()).includes(p.toLowerCase())
}

const LinkedAccountsForm = () => {
    const { t } = useLaravelReactI18n()
    return <RoundedForm title={t("settings.linked_accounts") as string}>

        <p>{t("settings.provider_text")}</p>
        <p className="text-secondary text-xs">{t("settings.provider_bonus_text")}</p>
        <div className="flex flex-col lg:flex-row gap-4 mt-8">
            {
                providers.map(p =>
                    <Link
                        href={route("socialite.redirect", { provider: p.name.toLowerCase() })}
                        className={(isAlreadyLinked(p.name) ? "pointer-events-none opacity-25 " : "") + `flex w-full items-center justify-center gap-3 rounded-md bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-secondary/25 hover:bg-secondary/25 focus-visible:ring-transparent`}
                    >
                        {p.icon}
                        <span className="text-sm font-semibold leading-6">
                            {
                                !isAlreadyLinked(p.name)
                                    ? t("settings.provider_link_with", { provider: p.name })
                                    : t("settings.provider_already_linked")
                            }
                        </span>
                    </Link>
                )
            }
        </div>
    </RoundedForm>
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

    return <RoundedForm onSubmit={handleSubmit} title={t("settings.account_informations") as string}>
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
                    <div className="grow">
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
                            className="border rounded border-secondary/25 p-4 "
                        />
                        <Error>{errors.bio}</Error>
                    </div>
                </Field>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:max-w-lg">
                    {
                        recentlySuccessful && <p className="text-success-light dark:text-success-dark text-sm">{t("settings.updated_successfully")}</p>
                    }
                    <button
                        type="submit"
                        className="flex w-full ms-auto sm:w-auto justify-center rounded-md bg-primary text-onPrimary px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
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
