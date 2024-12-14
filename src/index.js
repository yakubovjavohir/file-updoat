const express = require("express")
const cors = require("cors")
const file_upload = require("express-fileupload")
const path = require("node:path")
const fs = require("node:fs/promises")
const {ResData} = require("./lib/resData")
const {Repository} = require("./lib/repository")



const filePath = path.resolve("database", "file.json")
const fileRepo = new Repository(filePath)

const img_folder = path.join(__dirname, "../files/img-folder")
const video_folder = path.join(__dirname, "../files/video-folder")
const pdf_folder = path.join(__dirname, "../files/pdf-folder")



const app = express()

app.use(cors())
app.use(express.json())
app.use(file_upload())



app.post("/img-upload", async (req, res) => {
    const file = req.files.img;

    if (file.mimetype !== "image/png") {
        return res.status(400).json(new ResData(400, "bu IMG emas!"));
    }

    try {
        await fs.access(img_folder);
    } catch (err) {
        await fs.mkdir(img_folder, { recursive: true });
    }


    const targetFolder = path.join(__dirname, `../files/img-folder`);
    const targetPath = path.join(targetFolder, path.basename(file.name));

    try {
        await file.mv(targetPath);

        const img_data = {
            img_name: file.name,
            img_mimetype: file.mimetype
        };
        await fileRepo.writeAdd(img_data)
        const resdata = new ResData(200, "IMG QO'SHILDI", img_data);
        res.status(resdata.statusCode).json(resdata);
    } catch (err) {
        res.status(500).json(new ResData(500, "SERVERDA XATOLIK"));
    }
});


app.post("/video-upload", async (req, res)=>{
    const file = req.files.video;

    if (file.mimetype !== "video/mp4") {
        return res.status(400).json(new ResData(400, "bu VIDEO emas!"));
    }

    try {
        await fs.access(video_folder);
    } catch (err) {
        await fs.mkdir(video_folder, { recursive: true });
    }

    const targetFolder = path.join(__dirname, `../files/video-folder`);
    const targetPath = path.join(targetFolder, path.basename(file.name));

    try {
        await file.mv(targetPath);

        const video_data = {
            video_name: file.name,
            video_mimetype: file.mimetype
        };
        await fileRepo.writeAdd(video_data)
        const resdata = new ResData(200, "VIDEO QO'SHILDI", video_data);
        res.status(resdata.statusCode).json(resdata);
    } catch (err) {
        res.status(500).json(new ResData(500, "SERVERDA XATOLIK"));
    }
})

app.post("/pdf-upload", async (req, res)=>{
    const file = req.files.pdf;

    if (file.mimetype !== "application/pdf") {
        return res.status(400).json(new ResData(400, "bu PDF emas!"));
    }

    try {
        await fs.access(pdf_folder);
    } catch (err) {
        await fs.mkdir(pdf_folder, { recursive: true });
    }

    const targetFolder = path.join(__dirname, `../files/pdf-folder`);
    const targetPath = path.join(targetFolder, path.basename(file.name));

    try {
        await file.mv(targetPath);

        const pdf_data = {
            pdf_name: file.name,
            pdf_mimetype: file.mimetype
        };
        await fileRepo.writeAdd(pdf_data)
        const resdata = new ResData(200, "PDF QO'SHILDI", pdf_data);
        res.status(resdata.statusCode).json(resdata);
    } catch (err) {
        res.status(500).json(new ResData(500, "SERVERDA XATOLIK"));
    }
})


app.listen(7777, ()=>{
    console.log("http://localhost:7777");
    
})