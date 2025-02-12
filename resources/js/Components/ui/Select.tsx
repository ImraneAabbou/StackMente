import { InputHTMLAttributes } from "react";
import clsx from "clsx"

export default function Select(props: InputHTMLAttributes<HTMLSelectElement>) {
    return <select
        {...props}
        className={
            clsx(
                "block rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-secondary/25 placeholder:text-secondary focus:ring-2 focus:ring-inset focus:ring-secondary/25 sm:text-sm sm:leading-6 bg-surface-light dark:bg-surface-dark text-onSurface-dark dark:text-onSurface-light",
                props.className
            )
        } />
}
