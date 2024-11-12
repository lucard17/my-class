export async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Разбивает массив на чанки и обрабатывает каждый чанк
 */
export async function byChunks<T = object, R = void>(arr: T[], chunkSize: number, callback: (chunk: T[]) => Promise<R>) {
    const results = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        results.push(await callback(chunk));
    }
    return results;
}
