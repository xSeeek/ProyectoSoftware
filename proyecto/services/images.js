const multer  = require('multer');
const fs = require('fs')
const path = require('path');
const filesDir = './data/profiles/';

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, filesDir);
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var fileExtension = filename.split(".")[1];
        fs.readdir(filesDir, (err, files) => {
          if (err) throw err;
          for (const file of files)
            if(file.split(".")[0] == req.body.photoName)
              fs.unlink(path.join(filesDir, file), err => {
                  if (err) throw err;
              });
        });
        if(req.body.photoName != null && req.body.photoName != "")
          cb(null, req.body.photoName + '.' + fileExtension);
        else
          cb(null, Date.now() + '.' + fileExtension);
    }
});

var uploadPhoto = multer({storage: storage});

module.exports = {
    uploadPhoto
}