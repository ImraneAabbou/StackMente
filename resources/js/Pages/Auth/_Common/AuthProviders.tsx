import { ReactNode } from "react"
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
export default function AuthProviders() {
    return <div className="mt-6 grid grid-cols-2 gap-4">
        {
            providers.map(p =>
                <a
                    href={route("socialite.redirect", { provider: p.name.toLowerCase() })}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray/25 focus-visible:ring-transparent"
                >
                    {p.icon}
                    <span className="text-sm font-semibold leading-6">{p.name}</span>
                </a>
            )

        }
    </div>
}
