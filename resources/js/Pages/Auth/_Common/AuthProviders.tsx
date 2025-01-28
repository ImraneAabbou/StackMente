import { Link } from "@inertiajs/react"

export default function AuthProviders() {
    return <ul>
        <li>
            <Link href="/auth/google/redirect">Google</Link>
        </li>
        <li>
            <Link href="/auth/github/redirect">Github</Link>
        </li>
        <li>
            <Link href="/auth/facebook/redirect">Facebook</Link>
        </li>
    </ul>
}
