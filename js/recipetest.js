import express from "express"
import axios from "axios"
import cors from "cors"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT || 5100

app.use(cors())

app.get('/recipes/chicken', async (req, res) => {
    const response = await axios.get(
        'https://api.edamam.com/search?q=chicken&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}'
    )
    console.log(response.data)
    res.json(response.data)
})

app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
})
