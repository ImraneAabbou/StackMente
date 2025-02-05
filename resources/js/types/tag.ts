export interface Tag {
    id: number;
    name: string;
    created_at: string;
}

export interface TagWithCounts extends Tag {
    posts_count: number;
    questions_count: number;
    subjects_count: number;
    articles_count: number;
}
