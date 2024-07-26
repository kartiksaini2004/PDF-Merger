import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer"
import pdfMerge from "pdf-merge";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

function clearUploadsFolder () {
  const directory = 'uploads';
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  const mergedReady = false;
  res.render("upload", { mergedReady: mergedReady });
})

app.post("/upload", (req, res, next) => {
  clearUploadsFolder();
  next();
}, upload.array('pdfs', 12), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files Uploaded.")
  }
  console.log("Uploaded files:", req.files);
  const filePaths = req.files.map(file => path.join('uploads', file.originalname));
  console.log("File paths:", filePaths);
  try {
    const mergedPdfBuffer = await pdfMerge(filePaths, { output: 'Buffer' });
    const mergedPdfPath = path.join('uploads', 'merged.pdf');
    console.log(mergedPdfPath);
    fs.writeFileSync(mergedPdfPath, mergedPdfBuffer);
    res.redirect(`/loadDownload?path=${encodeURIComponent(mergedPdfPath)}`);
  } catch (err) {
    console.log(err);
  }
});

app.get("/loadDownload", (req, res) => {
  const mergedReady = true;
  res.render("upload.ejs", { mergedReady: mergedReady });
})

app.get("/download", (req, res) => {
  res.download('uploads/merged.pdf', 'merged.pdf')
})

app.get("/reset", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
})