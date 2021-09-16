const express = require('express')
const app = express()
const port = 3000

const convertISODateToAEST = require('./utilities/format-iso-date-to-AEST').convertISODateToAEST
const getRSSFeed = require('./utilities/rss-parser').getRSSFeed

async function getFeed() {
  let RSS_URL = `https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss`
  let rawFeed = await getRSSFeed(RSS_URL)

  let episodes = []
  let item = {}
  let EPISODES = 10

  for (i = 0; i < EPISODES; i++) {
    item.title = rawFeed.items[i].title
    item.audioUrl = rawFeed.items[i].enclosure.url
    item.publishedDate = convertISODateToAEST(rawFeed.items[i].pubDate)

    episodes.push(item)
    item = {}
  }

  let feed = {
    title: rawFeed.title,
    description: rawFeed.description,
    episodes
  }

  return feed
}

app.get('/', async (req, res) => { 
  res.status(200).send(await getFeed())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})