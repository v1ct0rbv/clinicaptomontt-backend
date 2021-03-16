const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { readdirSync} = require('fs')
require('dotenv').config()
    
// app
const app=express()




// middleware
app.use(morgan('dev'))
app.use(bodyParser.json({ limit:'1000mb' }))
app.use(cors())




//routes middleware
readdirSync('./routes').map((r) => 
app.use('/api',require("./routes/" + r))
)

// port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running in port ${port}`))