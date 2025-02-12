export function avatar(file?: string) {
    return file?.startsWith("http")
        ? file
        : `/images/users/${file ?? "DEFAULT.jpg"}`;
}
