import fs from "fs";
import path from "path";
import Busboy from "busboy";
// import md5 from "crypto-js/md5";
import moment from "moment";
import axios from "axios";
// import { getSession } from "next-auth/client";
// const Busboy = require('busboy');

const FormData = require("form-data");

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  console.log('orlo----------------------------> header -upload');
  // const session = await getSession({ req });
  const { upload } = req.query;

  const busboy = Busboy({ headers: req.headers });
  const dateName = moment().format("YYYYMMDDhhmmssmmmm");
  let dateFileName = "";


  // ------------------------------------------------------- upload image -------------------------------------------------------
  if (upload == "image-upload") {
    console.log('orlo----------------------------> image-upload');
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      console.log('mimetype ====? ' , mimetype);
      let dir = `${process.env.UPLOAD_PATH}/${'trrr'}/i/`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // console.log('file -->', file);
      // console.log('filename ----> ' , filename);
      // console.log('fieldname ---> ' , fieldname);
      dateFileName = dateName+".jpg";
      // console.log('--------------->' , dateFileName);
      // let saveTo = path.join(dir, dateFileName);
      file.pipe(fs.createWriteStream(dir+dateFileName));
      // dateFileName = dateName + path.extname(filename);
      // let saveTo = path.join(dir, dateFileName);
      // file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on("finish", function () {
      res.writeHead(200, { Connection: "close" });

      
      res.end(dateFileName.toString());
    });
    
    return req.pipe(busboy);
  }

};

export default (req, res) => {
  console.log('req --------------> ' , req.method);
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? // test(req, res)
      console.log("GET")
    : res.status(404).send("");
};
