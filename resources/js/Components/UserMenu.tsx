import { Menu, MenuItem, MenuItems, MenuButton, } from "@headlessui/react";
import Logout from "@/Components/icons/Logout";
import Switch from "@/Components/ui/Switch";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { ReactNode, useContext } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ProgressCircle } from "@/Components/ui/ProgressCircle";
import DarkMode from '@/Components/icons/DarkMode'
import Admin from '@/Components/icons/Admin'
import { avatar } from "@/Utils/helpers/path";
import ThemeCtx from "@/Contexts/ThemeCtx";
import SoundCtx from "@/Contexts/SoundCtx";
import SoundOn from "./icons/SoundOn";
import SoundOff from "./icons/SoundOff";
import Languages from "./icons/Languages";
import LangSelect from "./LangSelect";
import dir from "@/Utils/helpers/dir";

export default function UserMenu({ children }: { children?: ReactNode }) {
    const { t, currentLocale } = useLaravelReactI18n()
    const isRTL = dir(currentLocale()) === "rtl"
    const { auth: { user } } = usePage().props
    const { isDark, setDark } = useContext(ThemeCtx)
    const { isEnabled: isSoundEnabled, setEnabled: setSoundEnabled } = useContext(SoundCtx)
    const percentToNextLevelDirectioned =
        isRTL
            ? (1 - user.stats.xp.percent_to_next_level)
            : (user.stats.xp.percent_to_next_level - 1)

    return <Menu as="div" className="relative">
        <div>
            <MenuButton className="relative flex rounded-full text-sm items-center gap-3">
                <ProgressCircle size={48} value={percentToNextLevelDirectioned}>
                    <span className="absolute -inset-1.5" />
                    <img
                        alt=""
                        src={avatar(user.avatar)}
                        className="rounded-full"
                    />
                </ProgressCircle>
                {children}
            </MenuButton>
        </div>
        <MenuItems
            className="
                flex flex-col gap-1 p-1 py-2 mt-2 z-10 bg-surface-light dark:bg-surface-dark
                sm:absolute w-screen start-0 sm:start-auto fixed end-0 sm:max-w-64 rounded-md shadow-lg
            "
        >
            <MenuItem>
                <Link
                    href={route("profile.index")}
                    className="flex gap-4  px-4 py-2 text-sm rounded"
                >
                    <img src={avatar(user.avatar)} className="rounded-full size-12" />
                    <div className=''>
                        <div className='font-semibold'>{user.fullname}</div>
                        <div className='text-secondary text-xs'>{user.username}</div>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem>
                <div
                    className="flex gap-2 items-center text-start px-4 py-2 text-sm rounded"
                >
                    <Languages size={20} />
                    {t("content.language")}
                    <LangSelect onClick={(e) => e.preventDefault()} className="ms-auto" />
                </div>
            </MenuItem>
            <MenuItem>
                <button
                    onClick={(e) => { e.preventDefault(); setDark(!isDark) }}
                    className="flex gap-2 items-center justify-between text-start hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                >
                    <span className="flex gap-2 items-center">
                        <DarkMode size={20} />
                        {t("content.dark_mode")}
                    </span>
                    <Switch checked={isDark} className='pointer-events-none' />
                </button>
            </MenuItem>
            <MenuItem>
                <button
                    onClick={(e) => { e.preventDefault(); setSoundEnabled(!isSoundEnabled) }}
                    className="flex gap-2 items-center justify-between text-start hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                >
                    <span className="flex gap-2 items-center">
                        {
                            isSoundEnabled
                                ? <SoundOn />
                                : <SoundOff />
                        }
                        {t("content.sound")}
                    </span>
                    <Switch checked={isSoundEnabled} className='pointer-events-none' />
                </button>
            </MenuItem>
            {
                (user.role == "ADMIN" || user.role == "SUPER_ADMIN") &&
                <MenuItem>
                    <Link
                        href={route("admin.index")}
                        className="flex gap-2 items-center hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                    >
                        <Admin size={20} />
                        {t("content.admin_panel")}
                    </Link>
                </MenuItem>
            }
            <MenuItem>
                <Link
                    href={route("logout")}
                    method='post'
                    className="flex gap-2 items-center hover:bg-background-light dark:hover:bg-background-dark px-4 py-2 text-sm rounded"
                >
                    <Logout size={20} />
                    {t("content.logout")}
                </Link>
            </MenuItem>
        </MenuItems>
    </Menu >
}
