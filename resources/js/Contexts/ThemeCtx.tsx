import { createContext } from "react"

type ThemeCtxType = {
    isDark: boolean;
    setDark: (s: boolean) => any
}

const ThemeCtx = createContext<ThemeCtxType>({
    isDark: false,
    setDark: () => { }
})

export default ThemeCtx
