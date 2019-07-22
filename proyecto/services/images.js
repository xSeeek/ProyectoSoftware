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
        if(req.body.photoName != null && req.body.photoName != "")
        {
          fs.readdir(filesDir, (err, files) => {
            if (err) throw err;
            for (const file of files)
              if(file.split(".")[0] == req.body.photoName)
                fs.unlink(path.join(filesDir, file), err => {
                    if (err) throw err;
                });
          });
          cb(null, req.body.photoName + path.extname(filename));
        }
        else
          cb(null, Date.now() + path.extname(filename));
    }
});

var uploadPhoto = multer({storage: storage});

module.exports = {
    uploadPhoto
}