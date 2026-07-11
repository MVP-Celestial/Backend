const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../Services/storage.service");

async function uploadSong(req, res) {
  try {
    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    const tags = id3.read(songBuffer);

    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: tags.title,
        folder: "/cohort-2/moodify/songs",
      }),

      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: tags.title + ".jpeg",
        folder: "/cohort-2/moodify/posters",
      }),
    ]);

    const song = new songModel({
      title: tags.title,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood,
    });

    await song.save();

    res.status(201).json({
      message: "Song created Successfully",
      song,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getSong(req, res) {
  try {
    const { mood } = req.query;

    const song = await songModel.findOne({ mood });

    if (!song) {
      return res.status(404).json({
        message: "No song found for this mood",
      });
    }

    res.status(200).json({
      message: "Song fetched successfully",
      song,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  uploadSong,
  getSong,
};