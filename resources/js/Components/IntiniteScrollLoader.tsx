import { useState, useRef } from "react"
import type { ReactNode } from "react"
import { useInView } from "framer-motion"
import { router } from "@inertiajs/react"

export default function InfiniteScrollLoader(
    { children, url, onSuccess }
        : { children: ReactNode, url: string, onSuccess: (posts: any) => void }
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
                setTimeout(() => setShouldFetch(true), 1500)
            },
            onSuccess,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            //preserveUrl: true,
        })

    return <div ref={ref} className="bg-red-400">{children}</div>
}
