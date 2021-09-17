export function normalizeText<T>(name: T): string | T {
    try {
        return name
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/ı/gi, 'i')
            .replace(/[^a-z0-9]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    } catch (e) {
        console.error(e);
        return name;
    }
}
