const fs = require('fs/promises')
const fss = require('fs')

exports.stages = JSON.parse(fss.readFileSync('./views/stageConfig.json'))

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

exports.writeMapToJSON = async (pathToFile, map) => {
  const obj = {}
  for (const [key, val] of map) {
    obj[key] = val
  }
  try {
    fs.writeFile(pathToFile, JSON.stringify(obj))
  } catch (e) {
    console.log(`Failed to write map to "${pathToFile}"`)
    throw e
  }
}

exports.getMapFromFiles = async (pathsToFiles) => {
  const out = new Map()
  for (const pathToFile of pathsToFiles) {
    try {
      const rawData = await fs.readFile(pathToFile)
      const dataObj = JSON.parse(rawData)
      for (const prop in dataObj) {
        out.set(prop, dataObj[prop])
      }
    } catch (e) {
      console.log(`Failed to read file ${pathToFile}`)
      throw e
    }
  }
  return out
}

/** Given a map and a callback function returning a boolean, return a new map with key, value pairs where the values return a truthy value when passed to `callbackFn` */
exports.filterMapByValue = (map, callbackFn) => {
  const out = new Map()
  for (const [key, value] of map) {
    if (callbackFn(value)) {
      out.set(key, value)
    }
  }
  return out
}

exports.getArrayFromFile = async (pathToFile) => {
  try {
    const rawData = await fs.readFile(pathToFile)
    return JSON.parse(rawData)
  } catch (e) {
    throw e
  }
}
