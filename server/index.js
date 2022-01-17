const express = require('express')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3232

const app = express()

app.use(cors())

app.use('/api/search', require('./routes/searchResults.js'))

app.listen(PORT, () => console.log(`App has started on port ${PORT}`))
