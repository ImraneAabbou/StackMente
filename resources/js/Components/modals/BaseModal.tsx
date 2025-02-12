import { Dialog, DialogBackdrop } from '@headlessui/react'
import { ReactNode } from "react"

export interface BaseModalProps {
    open: boolean,
    onClose: () => any,
    children: ReactNode,
}

export default function BaseModal({ open = false, onClose, children }: BaseModalProps) {

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            {children}
        </Dialog>
    )
}
