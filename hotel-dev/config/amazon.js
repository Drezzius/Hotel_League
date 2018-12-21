const   keys = require('./keys')
        aws = require('aws-sdk'),
        multer = require('multer'),
        multerS3 = require('multer-s3'),
        path = require('path')

aws.config.update({
    secretAccessKey: keys.amazonSecret,
    accessKeyId: keys.AmazonAccessId
})
var s3 = new aws.S3()

module.exports = {
    amazonUploadHotel: multer({
        storage: multerS3({
            s3,
            bucket: keys.hotelBucketName,
            key: function (req, file, cb) {
                console.log(file)
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        }),
        fileFilter: function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
                cb(null, true)
            } else {
                req.flash('error_msg', 'Only Images Allowed (JPG, JPEG, PNG)!')
                cb(null, false)
            }
        },
    }),
    deleteImages: function(key) {
        let params = {
            Bucket: keys.hotelBucketName,
            Delete: {
                Objects: [{
                    Key: key
                }],
            }
        }
        s3.deleteObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
            } else {
                console.log('success')
            }
        })
    },
    deletePhotos: function(toLoop, paramName) {
    toLoop.forEach(item => {
        if (item.key === paramName) {
            let params = {
            Bucket: keys.hotelBucketName,
            Delete: {
                Objects: [{
                    Key: item.key
                }],
            }
        }
        s3.deleteObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
            } else {
                console.log('success')
            }
        })
        }
    })
}
}