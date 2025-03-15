import { createContext } from "react"

type ConfirmDeleteCtxType = {
    action: string;
    setAction: (s: string) => any
}

const ConfirmDeleteCtx = createContext<ConfirmDeleteCtxType>({
    action: "",
    setAction: (a: string) => a
})

export default ConfirmDeleteCtx
