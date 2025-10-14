import db from "#db/client";
import { createPlaylist } from "./queries/playlists.js";
import { createTrack } from "./queries/tracks.js";
import { createPlaylistTrack } from "./queries/playlists_tracks.js";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 10; i++) {
    await createPlaylist(`Playlist ${i}`, faker.lorem.sentence(2));
  }
  for (let i = 1; i <= 20; i++) {
    await createTrack(`Track ${1}`, faker.number.int({ min: 5, max: 100 }));
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(Math.random() * 10);
    const trackId = 1 + Math.floor(Math.random() * 20);
    await createPlaylistTrack(playlistId, trackId);
  }
}
