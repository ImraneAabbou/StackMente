export interface User {
    id: number;
    username: string;
    fullname: string;
    avatar?: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    status?: string;
    auth: {
        user: User;
    };
};
