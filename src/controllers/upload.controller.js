const HttpException = require("../utils/HttpException.utils");
const dotenv = require("dotenv");
const fs = require("fs");
const request = require("request");
dotenv.config();

/******************************************************************************
 *                              Upload Controller
 ******************************************************************************/
class UploadController {
  uploadImage = async (req, res, next) => {
    let image64 = Buffer(fs.readFileSync(req.file.path)).toString("base64");
    let options = {
      method: "POST",
      url: "https://api.imgur.com/3/image",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
      formData: {
        image: image64,
      },
    };
    request(options, function (error, responseImgur) {
      fs.unlink(req.file.path, () => {});
      if (error || !JSON.parse(responseImgur.body).data.link) {
        throw new HttpException(500, "Something went wrong with imgur");
      }
      res
        .status(201)
        .send({
          message: "Image uploaded",
          imgUrl: JSON.parse(responseImgur.body).data.link,
        });
    });
  };
}

module.exports = new UploadController();
