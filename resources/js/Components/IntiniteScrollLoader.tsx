import { useState, useRef } from "react"
import type { ReactNode } from "react"
import { useInView } from "framer-motion"
import { router } from "@inertiajs/react"
import { PageProps } from "@/types"

export default function InfiniteScrollLoader(
    { children, url, onSuccess, className }
        : { children: ReactNode, url: string, className?: string, onSuccess?: (page: PageProps) => any }
) {
    const ref = useRef<HTMLDivElement>(null)
    const [shouldFetch, setShouldFetch] = useState(true)
    const isInView = useInView(ref)

    if (isInView && shouldFetch)
        router.get(url, {}, {
            onStart() {
                setShouldFetch(false)
            },
            onFinish() {
                setTimeout(() => setShouldFetch(true), 500)
            },
            onSuccess: (page) => {
                if (!onSuccess) return
                onSuccess(page.props)
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
            //preserveUrl: true,
        })

    return <div ref={ref} className={className}>{children}</div>
}
