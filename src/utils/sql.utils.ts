/** Класс на основе массива, для вставки значений в запрос. При вызове push возвращает "?" */
export class SqlValuesArray extends Array {
    constructor() {
        super();
    }

    /**
     * Вставляет значение в массив и возвращает "?" для подстановки в текст запроса
     */
    //@ts-ignore
    push(value: any) {
        super.push(value);
        return "?";
    }
}
/**
 * Соединяет строки с условиями через AND и оборачивает в скобки, фильтрует пустые значения Если условий нет, или все строки пустые, возвращает пустую
 * строку
 */
export function and(...args: any[]) {
    const filtered = args.filter((i) => i !== "" && i !== undefined);
    if (!filtered.length) return "";
    return "(" + filtered.join(" AND ") + ")";
}

/**
 * Соединяет строки с условиями через OR и оборачивает в скобки, фильтрует пустые значения Если условий нет, или все строки пустые, возвращает пустую строку
 */
export function or(...args: any[]) {
    const filtered = args.filter((i) => i !== "" && i !== undefined);
    if (!filtered.length) return "";
    return "(" + filtered.join(" OR ") + ")";
}

/**
 * Если условие не пустое, добавляет перед условием WHERE
 */
export function where(statement: string) {
    if (!statement || statement === "") return "";
    return "WHERE " + statement;
}
/**
 * Если условие не пустое, добавляет перед условием HAVING
 */
export function having(statement: string) {
    if (!statement || statement === "") return "";
    return "HAVING " + statement;
}

/**
 * Удаляет лишние пробелы и пустые строки
 */
export function trimQuery(queryText: string) {
    const queryParts = queryText.split(`\n`).filter((s) => s.trim() !== ``);
    const spaces = Math.min(...queryParts.map((s) => s.search(/[^ ]/)));
    return queryParts.map((p) => p.slice(spaces)).join(`\n`);
}
