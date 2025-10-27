import express from "express";
const app = express();
export default app;

import playlistsRouter from "./api/playlists.js";
import tracksRouter from "./api/tracks.js";

app.use(express.json());

app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
