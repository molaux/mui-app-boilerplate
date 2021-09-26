import { addDays, subDays, subMinutes } from 'date-fns'
import { klona } from 'klona/lite'

export const nearestWeekDay = (baseDate, targetDate) => {
  let weeksDist = baseDate.getDay() - targetDate.getDay()
  // d l m m j v s
  // c   l         : -2
  // l   c         : 2
  // c     l       : -3
  // c       l     : -4 (7 - l + c = 3)
  //     l       c : 4 (-7 - l + c = -3)
  if (weeksDist > 3) {
    weeksDist = -7 - targetDate.getDay() + baseDate.getDay()
  } else if (weeksDist < -3) {
    weeksDist = 7 - targetDate.getDay() + baseDate.getDay()
  }

  return weeksDist !== 0
    ? addDays(targetDate, weeksDist)
    : targetDate
}

export const daysUntilNextDayOfWeek = (baseDayIndex, targetDayIndex, exclusive = false) => {
  if (exclusive
    ? targetDayIndex <= baseDayIndex
    : targetDayIndex < baseDayIndex) {
    return 7 - baseDayIndex + targetDayIndex
  }
  return targetDayIndex - baseDayIndex
}

export const nextDayOfWeek = (baseDate, targetDayIndex, exclusive = false) => addDays(
  baseDate, daysUntilNextDayOfWeek(baseDate.getDay(), targetDayIndex, exclusive)
)

export const openTimes = [
  [],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ],
  [
    { from: { hours: 9, minutes: 30 }, to: { hours: 13, minutes: 0 } },
    { from: { hours: 14, minutes: 30 }, to: { hours: 19, minutes: 0 } }
  ]
]
const reversedOpenTimes = klona(openTimes).reverse().map((ranges) => ranges.reverse())

export const hoursAgoAgainstOpenTime = (startFrom, minutes) => {
  let rest = minutes

  let currentOpenTimes = reversedOpenTimes.filter((_, i) => i >= 6 - startFrom.getDay())

  const toHM = (date) => (date instanceof Date
    ? ({ hours: date.getHours(), minutes: date.getMinutes() })
    : date)
  const compare = (d1, d2) => (d1.hours === d2.hours
    ? d1.minutes - d2.minutes
    : d1.hours - d2.hours)

  currentOpenTimes[0] = currentOpenTimes[0].reduce(
    (list, { from, to }) => (compare(toHM(startFrom), to) > 0
      ? [...list, { from, to }]
      : compare(toHM(startFrom), from) < 0
        ? list
        : [...list, { from, to: toHM(startFrom) }]),
    []
  )
  let dayOffset = 0
  while (rest > 0) {
    for (const dayRanges of currentOpenTimes) {
      for (const { from, to } of dayRanges) {
        const range = (to.hours - from.hours) * 60 + to.minutes - from.minutes
        if (rest > range) {
          rest -= range
        } else {
          const result = subDays(startFrom, -dayOffset)
          result.setHours(to.hours)
          result.setMinutes(to.minutes)
          return subMinutes(result, rest)
        }
      }
      dayOffset -= 1
    }
    currentOpenTimes = reversedOpenTimes
  }
  return null
}
