require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')

const logger = require('morgan')

const indexRouter = require('./routes/index')
const characterRouter = require('./routes/character')
const matchupRouter = require('./routes/matchup')
const aboutRouter = require('./routes/about')

const app = express()

const mongoose = require('mongoose')

async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
}
mongoConnect().catch((err) => console.log(err))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/character', characterRouter)
app.use('/matchup', matchupRouter)
app.use('/about', aboutRouter)

// forward any requests unhandled by routers to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  if (
    err.message.includes('buffering timed out') ||
    err.message.includes('bad auth')
  ) {
    err.message = 'Server failed to connect to database'
    err.status = 500
  }

  if (err.status === 404) {
    err.message = `Could not find resource ${req.originalUrl}`
  }

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
