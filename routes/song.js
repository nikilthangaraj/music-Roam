const express = require("express");
const passport = require("passport");
const Song = require("../models/Song");

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // req.user gets the user because of passport.authenticate
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
  }
);

// get route to a single song by name
router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.params;
    const songs = await Song.find({ name: songName }).populate("artist");
    return res.status(200).json({ data: songs });
  }
);

// Get route to get all songs any artist has published
// I will send the artist id and I want to see all songs that artist has published.
router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.params;
    // We can check if the artist does not exist
    const artist = await User.findOne({ _id: artistId });
    // ![] = false
    // !null = true
    // !undefined = true
    if (!artist) {
      return res.status(301).json({ err: "Artist does not exist" });
    }

    const songs = await Song.find({ artist: artistId });
    return res.status(200).json({ data: songs });
  }
);

// Get route to get all songs I have published.
router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // We need to get all songs where artist id == currentUser._id
    const songs = await Song.find({ artist: req.user._id }).populate("artist");
    return res.status(200).json({ data: songs });
  }
);

// for deleting a song

// Delete route for a single song by id
router.delete(
  "/delete/:songId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songId } = req.params;
    try {
      const song = await Song.findById(songId);

      if (!song) {
        return res.status(404).json({ err: "Song not found" });
      }

      // Optional: Check if the logged-in user is the owner of the song
      if (song.artist.toString() !== req.user._id.toString()) {
        return res.status(401).json({ err: "Unauthorized" });
      }

      await Song.findByIdAndDelete(songId);
      return res.status(200).json({ msg: "Song deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: "Server error" });
    }
  }
);

module.exports = router;
