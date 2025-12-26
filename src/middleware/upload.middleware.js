const multer = require('multer');

const storage = multer.memoryStorage();

const photoUpload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

const hotelInquiryUpload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
    { name: 'ownerSignature', maxCount: 1 },
    { name: 'hotelStamp', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 }
]);

module.exports = { photoUpload, hotelInquiryUpload };