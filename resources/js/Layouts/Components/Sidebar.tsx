import { ReactNode } from "react";
import { Link } from "@inertiajs/react"
import clsx from "clsx";
import Home from "@/Components/icons/Home";
import Questions from "@/Components/icons/Questions"
import Subjects from "@/Components/icons/Subjects"
import Articles from "@/Components/icons/Articles"
import Tags from "@/Components/icons/Tags";
import Rank from "@/Components/icons/Rank";

export default function NavLinks() {
    return <div className="sm:shrink-0 sm:sticky sm:h-screen sm:top-0 sm:flex items-center justify-center sm:w-16 fixed bottom-0 left-0 w-full">
        <div className="flex sm:flex-col gap-2 sm:-my-16 items-center justify-around bg-input-light dark:bg-input-dark sm:bg-transparent sm:dark:bg-transparent">
            {
                navigations.map(n => <SidebarLink {...n} />)
            }
        </div>
    </div>
}

interface NavLinkProps {
    className?: string;
    href: string;
    icon: ReactNode;
    isActive: () => boolean
}

const SidebarLink = ({ href, className, icon, isActive }: NavLinkProps) => {
    return <Link
        href={href}
        className={clsx("flex items-center justify-center w-12 h-12 rounded", isActive() ? "" : "text-gray hover:text-current", className)}
    >
        {icon}
    </Link>
}

const navigations: NavLinkProps[] = [
    {
        href: route("feed"),
        icon: <Home />,
        isActive: () => route().current("feed"),
    },
    {
        href: route("questions.index"),
        icon: <Questions />,
        isActive: () => route().current("questions.index"),
    },
    {
        href: route("subjects.index"),
        icon: <Subjects />,
        isActive: () => route().current("subjects.index"),
    },
    {
        href: route("articles.index"),
        icon: <Articles />,
        isActive: () => route().current("articles.index"),
    },
    {
        href: route("tags.index"),
        icon: <Tags />,
        isActive: () => false,
    },
    {
        href: route("rank"),
        icon: <Rank />,
        isActive: () => route().current("rank"),
    },
]
