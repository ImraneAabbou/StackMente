import { useForm } from "@inertiajs/react"
import { FormEvent } from "react"

export default function ReportForm({ action, onSuccess }: { action: string, onSuccess?: () => any }) {
    const { data, setData, post, errors, reset } = useForm(`ReportForm${action}`, {
        reason: "",
        explanation: "",
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        post(action, {
            onSuccess: () => {
                reset()
                if (onSuccess) onSuccess()
            }
        })
    }

    return <form onSubmit={handleSubmit}>
        <div>
            reason: <select value={data.reason} onChange={e => setData("reason", e.target.value)} >
                <option value=""></option>
            </select>
            {
                !!errors.reason &&

                <span className="text-red-400">{errors.reason}</span>
            }
        </div>
        <div>
            explanation: <input type="text" value={data.explanation} onChange={e => setData("explanation", e.target.value)} />
            {
                !!errors.explanation &&

                <span className="text-red-400">{errors.explanation}</span>
            }
        </div>

        <div>
            <button type="submit">Report</button>
        </div>
    </form>
}
