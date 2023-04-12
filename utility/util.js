exports.ymdToUnixTimestamp = (year, month, day) => {
  return Math.floor(Date.UTC(year, month - 1, day, 0, 0, 0, 0) / 1000)
}

exports.usdDate = (year, month, day, humanReadable) => {
  if (humanReadable) {
    return (
      year +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      day.toString().padStart(2, '0')
    )
  }
  return this.ymdToUnixTimestamp(year, month, day)
}

exports.portionDateRange = (
  yStart,
  mStart,
  dStart,
  yEnd,
  mEnd,
  dEnd,
  humanReadable
) => {
  const periods = []

  if (yStart === yEnd && mStart === mEnd) {
    periods.push([
      this.usdDate(yStart, mStart, dStart, humanReadable),
      this.usdDate(yEnd, mEnd, dEnd, humanReadable),
    ])
  } else {
    periods.push([
      this.usdDate(yStart, mStart, dStart, humanReadable),
      this.usdDate(
        mStart === 12 ? yStart + 1 : yStart,
        mStart === 12 ? 1 : mStart + 1,
        1,
        humanReadable
      ),
    ])

    for (let y = yStart; y <= yEnd; y++) {
      const monthStart = y === yStart ? mStart + 1 : 1
      const monthEnd = y === yEnd ? mEnd - 1 : 12
      for (let m = monthStart; m <= monthEnd; m++) {
        periods.push([
          this.usdDate(y, m, 1, humanReadable),
          this.usdDate(
            m === 12 ? y + 1 : y,
            m === 12 ? 1 : m + 1,
            1,
            humanReadable
          ),
        ])
      }
    }

    if (dEnd > 1) {
      periods.push([
        this.usdDate(yEnd, mEnd, 1, humanReadable),
        this.usdDate(yEnd, mEnd, dEnd, humanReadable),
      ])
    }
  }

  return periods
}