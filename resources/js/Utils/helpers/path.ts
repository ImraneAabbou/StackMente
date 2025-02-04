export function avatar(file?: string) {
    return `/images/users/${file ?? "DEFAULT.jpg"}`;
}
