import { DateTime } from "luxon"

export function shortDateFormat(date: string) {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)
}
