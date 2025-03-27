import { createContext } from "react"

type SoundCtxType = {
    isEnabled: boolean;
    setEnabled: (s: boolean) => any
}

const SoundCtx = createContext<SoundCtxType>({
    isEnabled: true,
    setEnabled: () => { }
})

export default SoundCtx
