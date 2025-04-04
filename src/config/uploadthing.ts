import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  audioUploader: f({
    audio: {
      maxFileCount: 1,
      maxFileSize: "128MB",
    },
  }).onUploadComplete((data) => {
    console.log(data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
