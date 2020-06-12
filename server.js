require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = 5002

const TWO_HOURS = 1000 * 60 * 60 * 2

const {
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SES_SECRET = 'ssh!quiet,it\'asecret!',
    // SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SES_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        samSite: true,
        secure: IN_PROD
    }
}))


// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true  })
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true  })


const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())


// authorization - adgang til admin

app.use('*admin*', (req, res, next) => {

    if (!req.session.userId) {
        return res.status(401).json({message: 'Du har ikke adgang'})
    }

    next()
})

const gaaderRouter = require('./routes/gaader.routes')
app.use('/gaarder', gaaderRouter)

const brugerRouter = require('./routes/bruger.routes')
app.use('/bruger/admin', brugerRouter)

const authRouter = require('./routes/auth.routes')
app.use('/auth', authRouter)

app.listen(PORT, () => console.log('Server køre på ' + PORT))