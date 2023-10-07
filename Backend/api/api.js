const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 3000

app.use(cors())

app.get("/data", (req, res) => {
    res.json({
        message: "Data received from the server!",
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
