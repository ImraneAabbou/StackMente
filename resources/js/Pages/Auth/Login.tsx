import { Link, useForm } from "@inertiajs/react"
import { FormEvent } from "react"
import AuthProviders from "./_Common/AuthProviders"

export default function Login() {
    const { data, setData, post, errors } = useForm("LoginForm", {
        login: "",
        password: ""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post("/login")
    }

    return <form onSubmit={handleSubmit}>
        <div>
            E-mail/Username : <input type="text" onChange={e => setData("login", e.target.value)} value={data.login} />
            {
                errors.login
                && <span className="text-red-400">{errors.login}</span>
            }
        </div>
        <div>
            Password : <input type="password" name="password" onChange={e => setData("password", e.target.value)} value={data.password} />
            {
                errors.password
                && <span className="text-red-400">{errors.login}</span>
            }
        </div>
        <div>
            <button type="submit">Login</button>
            <Link href="/register">you don't have account ?</Link>
        </div>
        <hr />
        <AuthProviders />
    </form>
}
