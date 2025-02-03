import { InputHTMLAttributes } from "react";
import clsx from "clsx"

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input
        {...props}
        className={
            clsx(
                "block checked:bg-green checked:hover:bg-green focus:checked:bg-green rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray/25 placeholder:text-gray focus:ring-2 focus:ring-inset focus:ring-gray/25 sm:text-sm sm:leading-6 bg-input-light dark:bg-input-dark",
                props.className
            )
        } />
}
