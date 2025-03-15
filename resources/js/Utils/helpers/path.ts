export function avatar(file?: string) {
    return file?.startsWith("http")
        ? file
        : `/images/users/${file ?? "DEFAULT.jpg"}`;
}

export function mission_image(file?: string) {
    return `/images/missions/${file ?? "DEFAULT.jpg"}`;
}
