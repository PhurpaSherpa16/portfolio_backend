import multer from "multer"

const storage = multer.memoryStorage()

export const multipleImageUpload = multer({storage, limits:{fileSize: 5 * 1024 * 1024},
    fileFilter:(req, file, cb) =>{
        if(file.fieldname === 'image'){
            const allowedMimeTypes =[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp"
            ]
            if(allowedMimeTypes.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(new Error("Invalid file type. Only image files are allowed."))
            }
        }else{
            cb(new Error("Invalid file field name."))
        }
    }
}).array('image', 10)


export const singleImageUpload = multer({storage, limits:{fileSize: 5 * 1024 * 1024},
    fileFilter:(req, file, cb) =>{
        if(file.fieldname === 'image'){
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp"
            ]
            if(allowedMimeTypes.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(new Error("Invalid file type. Only image files are allowed."))
            }
        }else{
            cb(new Error("Invalid file field name."))
        }
    }
}).single('image')


export const uploadFile = multer({
    storage, limits:{fileSize: 5 * 1024 * 1024},
    fileFilter:(req, file, cb) =>{
        if(file.fieldname === 'file'){
            const allowedMimeTypes = [
                "application/pdf",
                "application/msword",
            ]
            if(allowedMimeTypes.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(new Error("Invalid file type. Only PDF and Word documents are allowed."))
            }
        }else{
            cb(new Error("Invalid file field name."))
        }
    }
}).single('file')

export const uploadNone = multer().none()