const multer  = require('multer');
const fs = require('fs')
const path = require('path');
const filesDir = path.resolve('./data/');

var storagePhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir + '/profiles/');
  },
  filename: function (req, file, cb) {
      var filetype = getFileType(file);

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
        cb(null, req.body.photoName + '.' + filetype);
      }
      else
        cb(null, Date.now() + '.' + filetype);
  }
});

var storageCover = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir + '/covers/');
  },
  filename: function (req, file, cb) {
      var filetype = getFileType(file);

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
        cb(null, req.body.photoName + '.' + filetype);
      }
      else
        cb(null, Date.now() + '.' + filetype);
  }
});

var storagePhotoNews = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir + '/news/');
  },
  filename: function (req, files, cb) {
      var filetype = getFileType(files);

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
        cb(null, req.body.photoName + '.' + filetype);
      }
      else
        cb(null, Date.now() + '.' + filetype);
  }
});

function getFileType(file)
{
  if(file.mimetype === 'image/gif')
    return 'gif';
  if(file.mimetype === 'image/png')
    return 'png';
  if(file.mimetype === 'image/jpeg')
    return 'jpeg';
  if(file.mimetype === 'image/png')
    return 'png';
  return 'undefined';
}

var uploadPhoto = multer({storage: storagePhoto});
var uploadCover = multer({storage: storageCover});
var uploadBanner = multer({storage: storagePhotoNews});

module.exports = {
    uploadPhoto,
    uploadCover,
    uploadBanner
}