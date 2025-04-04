import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { deepgram } from "./config/deepgram";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/transcribe", async (req, res) => {
  const audioPath = path.resolve(__dirname, "../audio/IsM4bnJ-8Gw.mp3");
  const fileStream = fs.createReadStream(audioPath);

  const fileStat = fs.statSync(audioPath);
  const fileName = path.basename(audioPath);

  const form = new FormData();
  form.append("files", fileStream, {
    filename: fileName,
    contentType: "audio/mpeg",
    knownLength: fileStat.size,
  });
  try {
    const response = await fetch("https://uploadthing.com/api/uploadFiles", {
      method: "POST",
      headers: {
        ...form.getHeaders(),
        "x-uploadthing-api-key": process.env.UPLOADTHING_TOKEN!, // set this securely
        "x-uploadthing-uploadthinghook": "audioUploader", // your endpoint name
      },
      body: form,
    });

    const result = await response.text();
    console.log("UploadThing response:", result);

    res.json({ success: true, uploadthing: result });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(3000, () => {
  console.log(`App is running in port 3000`);
});

// const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
//   fs.readFileSync(audioPath),
//   {
//     model: "nova-3",
//     smart_format: true,
//     language: "en-US",
//     paragraphs: true,
//   }
// );

// if (error) throw error;

// if (!error) console.dir(result, { depth: null });

// res.json({
//   result,
//   error: error ? error : null,
// });
