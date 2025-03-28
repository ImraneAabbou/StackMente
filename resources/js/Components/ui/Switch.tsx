import { Switch as HUISwitch } from '@headlessui/react'
import clsx from 'clsx'

interface SwitchProps {
    className?: string
    checked: boolean
    onChange?: (a: boolean) => any
}

export default function Switch({ className, checked, ...props }: SwitchProps) {

    return (
        <HUISwitch
            dir="ltr"
            {...props}
            checked={checked}
            className={clsx(`${checked ? 'bg-primary' : 'bg-secondary'}
          relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`, className)}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0`}
            />
        </HUISwitch>
    )
}
