import ProfileDeleteCtx from "@/Contexts/ProfileDeleteCtx";
import ProfileLayout from "@/Layouts/ProfileLayout";
import { router, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { useContext } from "react";

export default function ProfileDelete() {
    const { t } = useLaravelReactI18n()
    const { setShow } = useContext(ProfileDeleteCtx)
    const user = usePage().props.auth.user

    return <ProfileLayout>
        <h2 className="text-2xl">{t("delete_account.heading")}</h2>
        <div dangerouslySetInnerHTML={{ __html: t("delete_account.text") as string }} className="[&_p]:my-8 mt-12" />
        <button
            className="my-8 ms-auto block rounded-md bg-error-light dark:bg-error-dark hover:bg-error-light/80 hover:dark:bg-error-dark/80 text-onError-light dark:text-onError-dark px-3 py-2 text-sm font-semibold shadow-xs w-auto"
            onClick={() => user.hasPassword ? setShow(true) : router.delete(route("profile.destroy"))}
        >
            {t("delete_account.confirmation_button")}
        </button>
    </ProfileLayout>
}
