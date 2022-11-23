const fs = require('fs')
const path = require('path')
const express = require('express')

const jsonPaintingPath = path.join(__dirname, 'data','paintings-nested.json')
const jsonPaintingData = fs.readFileSync(jsonPaintingPath, 'utf8')

const paintings = JSON.parse(jsonPaintingData)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/data/paintings-nested/', (req,resp) => {
    resp.json(paintings)
})

app.get('/data/paintings-nested/:id', (req,resp) => {
    const match = paintings.filter(p => p.paintingID == req.params.id)
    if(match.length > 0)
        resp.json(match)
    else
        resp.json("Painting Id not found, error!")
})

app.get('/data/paintings-nested/gallery/:galleryID', (req,resp) => {
    const match = paintings.filter(p => p.gallery.galleryID == req.params.galleryID)
    if(match.length > 0)
        resp.json(match)
    else
        resp.json("Gallery Id not found, error!")
})

app.get('/data/paintings-nested/artist/:id', (req,resp) => {
    const match = paintings.filter(p => p.artist.artistID == req.params.id)
    if(match.length > 0)
        resp.json(match)
    else
        resp.json("Artist Id not found, error!")
})

app.get('/data/paintings-nested/year/:min/:max', (req,resp) => {
    const match = paintings.filter(function(item) {
        return (item.yearOfWork >= req.params.min && item.yearOfWork <= req.params.max);
      });
    if(match.length > 0)
        resp.json(match)
    else
        resp.json("Paintings not found within those years, error!")
})

app.get('/data/paintings-nested/title/:text', (req,resp) => {
    const text = req.params.text.toLowerCase()
    const matches = paintings.filter((p) => p.title.toLowerCase().includes(text))
    if(matches.length > 0)
        resp.json(matches)
    else
        resp.json("Title not found, error!")

})

//Work in Progress
app.get('/data/paintings-nested/color/:name', (req,resp) => {
    // const colors = paintings.dominantColors.map(c => c.name)
    // const match = colors.filter(p => p.names == req.params.name)
    const string = req.params.name.toLowerCase()
    //const match = paintings.filter((c) => c.dominantColors.name.toLowerCase().includes(string))
    const colors = paintings.dominantColors.find(({name}) => name === string)
    if(match.length > 0)
        resp.json(match)
    else
        resp.json("Color not found, error!")
})
///--------------------------------------------------


const jsonArtistPath = path.join(__dirname, 'data','artists.json')
const jsonArtistData = fs.readFileSync(jsonArtistPath, 'utf8')

const artists = JSON.parse(jsonArtistData)

app.get('/data/artists/', (req,resp) => {
    resp.json(artists)
})


app.get('/data/artists/:country', (req,resp) => {
    const text = req.params.country.toLowerCase()
    const matches = artists.filter(a => a.Nationality.toLowerCase() == text)
    if(matches.length > 0)
        resp.json(matches)
    else
        resp.json("Country not found, error!")

})

const jsonGalleryPath = path.join(__dirname, 'data','galleries.json')
const jsonGalleryData = fs.readFileSync(jsonGalleryPath, 'utf8')

const galleries = JSON.parse(jsonGalleryData)

app.get('/data/galleries/', (req,resp) => {
    resp.json(galleries)
})

app.get('/data/galleries/:country', (req,resp) => {
    const text = req.params.country.toLowerCase()
    const matches = galleries.filter(g => g.GalleryCountry.toLowerCase() == text)
    if(matches.length > 0)
        resp.json(matches)
    else
        resp.json("Country not found, error!")

})

let port = 8080
app.listen(port, () => {
})