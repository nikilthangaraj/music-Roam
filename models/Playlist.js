const mongoose = require("mongoose");

// creating a user schema
const Playlist = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Song",
    },
  ],
  collaborators: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

// create a model
const PlaylistModel = mongoose.model("Playlist", Playlist);
module.exports = PlaylistModel;
