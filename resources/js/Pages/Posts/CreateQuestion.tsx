import { PostType } from "@/types/post"
import { useForm } from "@inertiajs/react"
import { FormEvent } from "react"

export default function PostsCreate() {
    const { errors, data, setData, post } = useForm("CreateQuestion", {
        title: "",
        type: PostType.QUESTION,
        content: "",
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post("/posts")
    }

    return <form onSubmit={handleSubmit}>
        <div>
            Question:
            <input type="text" onChange={(e) => setData("title", e.target.value)} value={data.title} />
            {
                errors.title && <p className="text-red-400">{errors.title}</p>
            }
        </div>
        <div>
            Explain your question more & give more details:
            <textarea onChange={(e) => setData("content", e.target.value)} value={data.content} />
            {
                errors.content && <p className="text-red-400">{errors.content}</p>
            }
        </div>
        <button type="submit">submit</button>
    </form>
}
