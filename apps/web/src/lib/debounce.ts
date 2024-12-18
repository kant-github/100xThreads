export function debounce(func: (...args: any[]) => void, delay: number) {
    let timeOut: NodeJS.Timeout;

    return (...args: any[]) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => func(...args), delay)
    };
}