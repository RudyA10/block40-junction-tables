import express from "express";
const router = express.Router();
export default router;

import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
} from "#db/queries/playlists";

import { getTracksByPlaylistId } from "#db/queries/tracks";
import { createTrackByPlaylistId } from "#db/queries/playlists_tracks";

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const playlists = await getPlaylists();
      res.send(playlists);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res
        .status(400)
        .send("Request is missing one of the following: name, description");

    const playlist = await createPlaylist(name, description);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  if (isNaN(id)) return res.status(400).send("Playlist ID must be a number");

  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist does not exist");

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    try {
      if (isNaN(req.params.id))
        return res.status(400).send("Playlist ID must be a number");
      const playlistTracks = await getTracksByPlaylistId(req.playlist.id);
      res.send(playlistTracks);
    } catch (error) {
      next(error);
    }
  })

  .post(async (req, res) => {
    try {
      if (Number.isNaN(Number(req.params.id)))
        return res.status(400).send("Playlist ID must be a number");
      if (!req.body) return res.status(400).send("Request body required.");

      const { track_id } = req.body;
      if (!track_id)
        return res.status(400).send("Request body needs: track_id");
      if (isNaN(track_id))
        return res.status(400).send("track_id must be a number");

      const newTrack = await createTrackByPlaylistId(req.playlist.id, track_id);
      res.status(201).send(newTrack);
    } catch (error) {
      next(error);
    }
  });
