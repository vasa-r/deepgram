import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { deepgram } from "./config/deepgram";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/transcribe", async (req, res) => {
  const audioPath = path.resolve(__dirname, "../audio/IsM4bnJ-8Gw.mp3");

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync(audioPath),
    {
      model: "nova-3",
      smart_format: true,
      language: "en-US",
      paragraphs: true,
    }
  );

  if (error) throw error;

  if (!error) console.dir(result, { depth: null });

  res.json({
    result,
    error: error ? error : null,
  });
});

app.listen(3000, () => {
  console.log(`App is running in port 3000`);
});
