import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import os from "os";

import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const app = express();
app.use(fileUpload());
dotenv.config();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads/webp"));

app.get("/", (req, res) =>
  res.send({ homepage: req.protocol + ":" + req.get("host") })
);



app.post("/", (req, res) => {
  const file_type = "image";
  const uid = new Date().toDateString() + new Date().getTime();
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ error: "no files uploading  " });
  }
  if (!req.files.sampleFile) return res.send({ error: "no file found" });
  const { sampleFile } = req.files;
  if (sampleFile.length != undefined)
    return res.send({ error: "multiple files sending" });
  var file_types = sampleFile.mimetype.split("/");
  if (!file_types.includes(file_type))
    return res.send({ error: "not an image" });
  //   console.log((sampleFile.name).replaceAll(/\s/g,''))

  var upload_path =
    "/uploads/" +
    "profile_" +
    uid.replaceAll(/\s/g, "");
  // console.log(path.dirname);
  sampleFile.mv("." + upload_path+
  path.extname(sampleFile.name), function (err) {
    if (!err) {    
        
        // converting into webp


        imagemin(["./"+upload_path+
        path.extname(sampleFile.name)], {
            destination: "./uploads/webp/",
            plugins: [
              imageminWebp({
                  quality: 80
                //   ,
                //   resize: {
                //     width: 1000,
                //     height: 0
                //   }
              }),
            ],
          }).then(() => {
            console.log("Images Converted Successfully!!!");
          }).catch((err)=>console.log(err));


      return res.send({
        message: "file send ok",
        path: req.protocol + "://" + req.get("host") + upload_path+".webp",
      });
    } else {
      //   converting image into webp

     
      
      return res.send({ message: err });
    }
  });
});





app.get("/images/:name", (req, res) => [console.log(req.params.name)]);

app.listen(process.env.PORT, (req, res) => {
  console.log("server running at http://localhost:4000");
});
