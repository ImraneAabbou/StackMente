import Error from "@/Components/ui/Error";
import Status from "@/Components/ui/Status";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { MenuItem, Menu, MenuItems, MenuButton } from "@headlessui/react";
import Trash from "@/Components/icons/Trash";
import Download from "@/Components/icons/Download";
import DBRestore from "@/Components/icons/DBRestore";
import VerticalDots from "@/Components/icons/VerticalDots";
import { useRef } from "react";
import DB from "@/Components/icons/DB";

export default function AdminBackupIndex() {
    const { status, backups } = usePage().props
    const backupInputRef = useRef<null | HTMLInputElement>(null)
    const { errors, post, data, setData, reset, put } = useForm({ backup: null as (File | null) });
    const { t } = useLaravelReactI18n()

    if (data.backup) {
        post(route("backups.store"), {
            // @ts-ignore
            data: {
                backup: data.backup
            },
        })
        reset()
    }

    return <AdminLayout>
        <div className="flex sm:flex-row flex-col gap-8 justify-between sm:items-center">
            <div className="flex flex-col">
                <h1 className="text-2xl font-display">{t("backup.backup_and_restore")}</h1>
                <p className="text-secondary">{t("backup.backup_and_restore_desc")}</p>
                <Status className="text-success-light dark:text-success-dark font-semibold">{status}</Status>
                <Error className="font-semibold">{errors.backup}</Error>
            </div>
            <div className="flex justify-end ms-auto gap-2">
                <button
                    onClick={() => backupInputRef.current?.click()}
                    className="flex shrink-0 justify-center rounded-md bg-surface-light dark:bg-surface-dark px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-surface-light/50 dark:hover:bg-surface-dark/50"
                >
                    <input
                        ref={backupInputRef}
                        type="file"
                        onChange={(e) => setData("backup", (e.target.files!)[0])}
                        className="hidden"
                    />
                    {t("backup.upload")}
                </button>
                <button
                    onClick={() => post(route("backups.store"))}
                    className="flex shrink-0 justify-center rounded-md bg-primary text-onPrimary px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90"
                >
                    {t("backup.create")}
                </button>
            </div>
        </div>
        <section className="mt-8">
            {
                !backups.length
                    ?
                    <div className="text-secondary text-xl flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <DB size={64} />
                            {t("backup.no_backup_found")}
                        </div>
                    </div>
                    : <table className="min-w-full divide-y divide-secondary/25">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-start text-sm font-semibold sm:pl-0">
                                    {t("backup.name")}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold hidden sm:table-cell">
                                    {t("backup.size")}
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/25">
                            {backups.map(b => (
                                <tr key={b.name}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                                        {b.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary hidden sm:table-cell">{b.size}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <Menu>
                                            <MenuButton className="py-1.5 px-3">
                                                <VerticalDots />
                                            </MenuButton>

                                            <MenuItems
                                                anchor="bottom end"
                                                className="w-52 origin-top-right rounded-md bg-surface-light dark:bg-surface-dark p-1 text-sm/6"
                                            >
                                                <MenuItem>
                                                    <a
                                                        href={route("backups.show", { backup: b.name })}
                                                        download
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark">
                                                        <Download size={16} />
                                                        {t("backup.download")}
                                                    </a>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => put(route("backups.update", { backup: b.name }))}
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-background-light dark:hover:bg-background-dark">
                                                        <DBRestore size={16} />
                                                        {t("backup.restore")}
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link
                                                        href={route("backups.destroy", { backup: b.name })}
                                                        method="delete"
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-error-light dark:text-error-dark hover:bg-background-light dark:hover:bg-background-dark">
                                                        <Trash size={16} />
                                                        {t("content.delete")}
                                                    </Link>
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            }
        </section>
    </AdminLayout>
}
