import { createContext } from "react"

type ProfileDeleteCtxType = {
    isShown: boolean;
    setShow: (s: boolean) => any
}

const ProfileDeleteCtx = createContext<ProfileDeleteCtxType>({
    isShown: false,
    setShow: () => {}
})

export default ProfileDeleteCtx
