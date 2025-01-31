import { useForm } from "@inertiajs/react"
import { FormEvent } from "react"
import {
    OFFENSIVE_LANGUAGE,
    HARASSMENT,
    INAPPROPRIATE,
    SPAM_OR_CHEATING,
    OTHER
} from "@/Enums/ReportReason"

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
                <option value={OFFENSIVE_LANGUAGE}>Offensive Language</option>
                <option value={HARASSMENT}>Harassement</option>
                <option value={INAPPROPRIATE}>Inappropriate</option>
                <option value={SPAM_OR_CHEATING}>Spam or Cheating</option>
                <option value={OTHER}>Other</option>
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
