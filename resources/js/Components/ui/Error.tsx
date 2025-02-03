import clsx from "clsx"

interface ErrorComponentProps {
    children?: string
    className?: string
}

export default function Error({ children, className }: ErrorComponentProps) {
    return !!children && <span
        className={clsx("text-xs text-error-light dark:text-error-dark", className)}
    >
        {children}
    </span>
}
