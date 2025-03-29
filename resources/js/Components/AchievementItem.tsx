import { Mission } from "@/types/mission";
import { mission_image } from "@/Utils/helpers/path";

export default function AchievementItem({ mission: m }: { mission: Mission }) {
    return <div className="flex flex-col gap-2 text-center" title={m.description}>
        <img src={mission_image(m.image)} className="size-24 mx-auto" />
        <span className={`font-semibold text-xs`}>
            {m.title}
        </span>
    </div>
}
