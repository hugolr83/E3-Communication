import { compareDesc, format } from 'date-fns'

export const convertDate = (oldDate: Date): string => {
  return format(new Date(oldDate), 'PPpp')
}

export const isEarlierDate = (dateToTest: Date, mainDate: Date): boolean => {
  return compareDesc(new Date(dateToTest), new Date(mainDate)) !== -1
}

export const isLaterDate = (dateToTest: Date, mainDate: Date): boolean => {
  return compareDesc(new Date(dateToTest), new Date(mainDate)) !== 1
}
