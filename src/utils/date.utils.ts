//@ts-ignore
import { asString as dateAsString } from "date-format"; /* Эта библиотека используется в log4js по этому решил использовать ее */

export function dateFormat(date: Date, mask: string): string {
    return dateAsString(mask, date);
}

export function offsetDate(date: Date | string | number, { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = {}): Date {
    const newDate = new Date(date);
    if (years !== 0) newDate.setFullYear(newDate.getFullYear() + years);
    if (months !== 0) newDate.setMonth(newDate.getMonth() + months);
    if (weeks !== 0) newDate.setDate(newDate.getDate() + weeks * 7);
    if (days !== 0) newDate.setDate(newDate.getDate() + days);
    if (hours !== 0) newDate.setHours(newDate.getHours() + hours);
    if (minutes !== 0) newDate.setMinutes(newDate.getMinutes() + minutes);
    if (seconds !== 0) newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate;
}
