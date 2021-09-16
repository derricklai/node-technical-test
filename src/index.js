const express = require('express')
const app = express()
const port = 3000

const convertISODateToAEST = require('./utilities/format-iso-date-to-AEST').convertISODateToAEST
const getRSSFeed = require('./utilities/rss-parser').getRSSFeed

// this function fetches the raw RSS feed and returns the first 10 episodes
// sort parameter to return utc dates for sorting
async function getFeed(sort = false) {
  let RSS_URL = `https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss`
  let rawFeed

  try {
    rawFeed = await getRSSFeed(RSS_URL)
  } catch (err) {
    res.status(500)
  }

  let episodes = []
  let item = {}
  let EPISODES = 10

  for (i = 0; i < EPISODES; i++) {
    item.title = rawFeed.items[i].title
    item.audioUrl = rawFeed.items[i].enclosure.url
    item.publishedDate = sort ? convertISODateToAEST(rawFeed.items[i].pubDate, true) : convertISODateToAEST(rawFeed.items[i].pubDate)

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

app.get('/sort', async (req, res) => {
  let sortBy = req.query.order
  let sortedFeed
  
  try {
    sortedFeed = await getFeed(sortBy)
  } catch (err) {
    res.status(500)
  }

  if (sortBy === 'asc')
    sortedFeed.episodes.sort((a, b) => a.publishedDate - b.publishedDate)
  else if (sortBy === 'dsc')
    sortedFeed.episodes.sort((a, b) => b.publishedDate - a.publishedDate)

  // Convert code back into correct AEST format
  sortedFeed.episodes.forEach(item => { item.publishedDate = convertISODateToAEST(item.publishedDate)})

  res.status(200).send(sortedFeed)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
