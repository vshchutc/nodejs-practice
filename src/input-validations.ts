import { format, isValid, parse, parseISO } from 'date-fns'

// RegExp to check if a string can be parsed as a decimal number
//
// ^ - Start of line
// \d* - 0 or more digits
// \.? - An optional dot
// \d* - 0 or more digits
// $ - End of line

const decimalCheck = /^\d*\.?\d*$/


export function validateDate(dateString: string): string {
  return dateToString(stringToDate(dateString))
}

export function stringToDate(dateString: string): Date {
  try {
    let date = parseISO(`${dateString}T00:00:00Z`)

    if (!isValid(date)) {
      throw `Date string "${dateString}" is not in the correct format. Please use yyyy-MM-dd`
    }

    return date
  } catch (error) {
    throw 'Could not parse date string. Please use yyyy-MM-dd'
  }
}

export function dateToString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function validateStartAddress(start: string): string {
  if (!start) throw `Starting address is not provided. Please enter an address`
  return start
}

export function validateEndAddress(end: string): string {
  if (!end) throw `Destination address is not provided. Please enter an address`
  return end
}

export function validateCost(cost: string): number {
  if (!cost) throw `Cost is not provided. Please enter the price of the ride`

  if (!decimalCheck.test(cost)) {
    throw `Cost "${cost}" is not in the correct format. Please enter a number, with dot as a separator if needed.`
  }

  try {
    return parseFloat(cost)
  } catch (error) {
    throw `Cost "${cost}" is not in the correct format. Please enter a number, with dot as a separator if needed.`
  }
}

export function validateDistance(distance: string): number {
  if (!distance) throw(`Please enter the distance of the ride`)

  if (!decimalCheck.test(distance)) {
    throw `Distance "${distance}" is not in the correct format. Please enter a number, with dot as a separator if needed.`
  }

  try {
    return parseFloat(distance)
  } catch (error) {
    console.log('HERE')
    throw `Distance "${distance}" is not in the correct format. Please enter a number, with dot as a separator if needed.`
  }
}
