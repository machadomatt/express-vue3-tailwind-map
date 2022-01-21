const express = require('express')
const axios = require('axios')
const url = require('url')
const router = express.Router()

router.get('/:query', async (req, res) => {
    try {
        const params = new URLSearchParams({
            access_token: process.env.API_KEY,
            ...url.parse(req.url, true).query,
        })

        const results = await axios(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.params.searchText}.json?${params}`
        )

        results.data.features.forEach((item) => {
            item.city = null
            item.state = null

            item.context.forEach((type) => {
                if (type.id.includes('place')) item.city = type.text
                if (type.id.includes('region')) item.state = type.text
            })
        })

        return res.status(200).json(results.data)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

module.exports = router
