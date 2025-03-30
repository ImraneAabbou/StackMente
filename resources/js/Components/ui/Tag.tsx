import clsx from "clsx";
import { ReactNode } from "react"

interface TagProps {
    children: ReactNode;
    className?: string
}

export default function Tag({ children, className = "" }: TagProps) {
    return <span className={clsx("text-xs font-semibold bg-secondary/25 px-2 py-1 rounded", className)}>
        {children}
    </span>
}
