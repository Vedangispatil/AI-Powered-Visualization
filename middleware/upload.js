const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype ==='application/vnd.ms-excel' ) {
            req.isFileNotSupported = false
            cb(null, true);
        } else {
            req.isFileNotSupported =  true
            cb(null, false);
            //cb(new Error('Only Excel files allowed!'), false);
        }
    }
});

module.exports = upload;