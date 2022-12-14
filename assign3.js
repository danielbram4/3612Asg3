const fs = require("fs");
const path = require("path");
const express = require("express");

const jsonPaintingPath = path.join(__dirname, "data", "paintings-nested.json");
let paintings = null;

fs.readFile(jsonPaintingPath, (err, data) => {
  if (err) {
    throw err;
  } else {
    paintings = JSON.parse(data);
  }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Returns JSON for all paintings
app.get("/paintings/", (req, resp) => {
  resp.json(paintings);
});

//Returns JSON for the single painting whose id matches the provided id.
app.get("/painting/:id", (req, resp) => {
  const match = paintings.filter((p) => p.paintingID == req.params.id);
  if (match.length > 0) resp.json(match);
  else resp.json("Painting with that Id not found, error!");
});

//Returns JSON for the paintings whose gallery id matches the provided gallery id.
app.get("/painting/gallery/:galleryID", (req, resp) => {
  const match = paintings.filter(
    (p) => p.gallery.galleryID == req.params.galleryID
  );
  if (match.length > 0) resp.json(match);
  else resp.json("Gallery with that Id not found, error!");
});

//Returns JSON for the paintings whose artist id matches the provided artist id.
app.get("/painting/artist/:id", (req, resp) => {
  const match = paintings.filter((p) => p.artist.artistID == req.params.id);
  if (match.length > 0) resp.json(match);
  else resp.json("Artist with that Id not found, error!");
});

//Returns all paintings whose yearOfWork field is between the two supplied values.
app.get("/painting/year/:min/:max", (req, resp) => {
  const match = paintings.filter(function (item) {
    return (
      item.yearOfWork >= req.params.min && item.yearOfWork <= req.params.max
    );
  });
  if (match.length > 0) resp.json(match);
  else resp.json("Paintings not found within those years, error!");
});

//Returns JSON for the paintings whose title contains (somewhere) the provided text.
app.get("/painting/title/:text", (req, resp) => {
  const text = req.params.text.toLowerCase();
  const matches = paintings.filter((p) => p.title.toLowerCase().includes(text));
  if (matches.length > 0) resp.json(matches);
  else resp.json("Title not found, error!");
});

//Returns JSON for the paintings that have a color that matches the provided hex value.
app.get("/painting/color/:name", (req, resp) => {
  let match;
  const color = req.params.name.toLowerCase();
  match = paintings.filter((p) =>
    p.details.annotation.dominantColors.some(
      (c) => c.name.toLowerCase() == color
    )
  );
  if (match.length > 0) resp.json(match);
  else resp.json("Color not found, error!");
});

const jsonArtistPath = path.join(__dirname, "data", "artists.json");

let artists;

fs.readFile(jsonArtistPath, (err, data) => {
  if (err) {
    throw err;
  } else {
    artists = JSON.parse(data);
  }
});

//Returns JSON for all artists
app.get("/artists/", (req, resp) => {
  resp.json(artists);
});

//Returns JSON for all artists from the specified country
app.get("/artists/:country", (req, resp) => {
  const text = req.params.country.toLowerCase();
  const matches = artists.filter((a) => a.Nationality.toLowerCase() == text);
  if (matches.length > 0) resp.json(matches);
  else resp.json("Artists in that Country not found, error!");
});

const jsonGalleryPath = path.join(__dirname, "data", "galleries.json");

let galleries;

fs.readFile(jsonGalleryPath, (err, data) => {
  if (err) {
    throw err;
  } else {
    galleries = JSON.parse(data);
  }
});

//Returns JSON for all galleries
app.get("/galleries/", (req, resp) => {
  resp.json(galleries);
});

//Returns JSON for all galleries from the specified country.
app.get("/galleries/:country", (req, resp) => {
  const text = req.params.country.toLowerCase();
  const matches = galleries.filter(
    (g) => g.GalleryCountry.toLowerCase() == text
  );
  if (matches.length > 0) resp.json(matches);
  else resp.json("Galleries in that Country not found, error!");
});

app.listen(process.env.PORT || 80, () =>
  console.log("Server on" + process.env.port)
);
