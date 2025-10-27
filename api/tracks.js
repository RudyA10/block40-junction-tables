import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  try {
    if (Number.isNaN(Number(req.params.id)))
      return res.status(400).send("ID must be a valid number.");
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found.");
    // possible issue in the future??
    res.send(track);
  } catch (error) {
    next(error);
  }
});
