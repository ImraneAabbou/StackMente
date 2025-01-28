import { useForm } from "@inertiajs/react"
import { FormEvent } from "react"
import AuthProviders from "./_Common/AuthProviders"

export default function Register() {
    const { post, data, setData, errors } = useForm("RegisterForm", {
        fullname: "",
        email: "",
        password: "",
        password_confirmation: "",
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post("/register")
    }

    return <form onSubmit={handleSubmit}>
        <div>
            Fullname: <input type="text" onChange={e => setData("fullname", e.target.value)} value={data.fullname} />
            {
                errors.fullname
                && <span className="text-red-400">{errors.fullname}</span>
            }
        </div>
        <div>
            Email: <input type="email" onChange={e => setData("email", e.target.value)} value={data.email} />
            {
                errors.email
                && <span className="text-red-400">{errors.email}</span>
            }
        </div>
        <div>
            Password: <input type="password" onChange={e => setData("password", e.target.value)} value={data.password} />
            {
                errors.password
                && <span className="text-red-400">{errors.password}</span>
            }
        </div>
        <div>
            Password Confirmation: <input type="password" onChange={e => setData("password_confirmation", e.target.value)} value={data.password_confirmation} />
            {
                errors.password
                && <span className="text-red-400">{errors.passwordConfirmation}</span>
            }
        </div>
        <div>
            <button type="submit">Register</button>
        </div>
        <hr />
        <AuthProviders />
    </form>
}
