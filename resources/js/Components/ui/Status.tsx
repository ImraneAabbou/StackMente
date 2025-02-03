import clsx from "clsx"

export default function Status({ children, className = "" }: { children?: string, className?: string }) {

    return children && <span className={clsx("text-sm", className)}>
        {
            children
        }
    </span>
}
