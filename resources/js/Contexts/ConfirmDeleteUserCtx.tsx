import { createContext } from "react"

type ConfirmDeleteUserCtxType = {
    action: string;
    setAction: (s: string) => any
}

const ConfirmDeleteUserCtx = createContext<ConfirmDeleteUserCtxType>({
    action: "",
    setAction: (a: string) => a
})

export default ConfirmDeleteUserCtx
