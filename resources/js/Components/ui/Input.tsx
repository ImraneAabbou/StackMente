import { InputHTMLAttributes } from "react";
import clsx from "clsx"

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input
        {...props}
        className={
            clsx(
                "block checked:bg-success-light dark:checked:bg-success-dark checked:hover:bg-success-light dark:checked:hover:bg-success-dark dark:focus:checked:bg-success-dark focus:checked:bg-success-light rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-secondary/25 placeholder:text-secondary focus:ring-2 focus:ring-inset focus:ring-secondary/25 sm:text-sm sm:leading-6 bg-surface-light dark:bg-surface-dark text-onSurface-dark dark:text-onSurface-light",
                props.className
            )
        } />
}
