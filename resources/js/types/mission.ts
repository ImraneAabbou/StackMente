export interface Mission {
    id: number;
    created_at: string;
    image: string;
    title: string;
    description: string;
    threshold: string;
    xp_reward: string;
    type: string;
};

export interface AccomplishedMission extends Mission {
    pivot: {
        accomplished_at: string;
    };
}
