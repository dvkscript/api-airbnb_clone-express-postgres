const resUtil = require("../../utils/res.util");
const File = require("../../enums/file");
const photoService = require("../../services/photo.service")
const {object} = require("yup");

module.exports = resUtil.catchError(async (req, res, next) => {

    if (!req.files) {
        throw new resUtil.CatchError({
            status: 400,
            message: "File name doesn't exist"
        })
    }
    const fileName = Object.keys(req.files)[0];

    if (!fileName) {
        throw new resUtil.CatchError({
            status: 400,
            message: "File name doesn't exist"
        })
    }

    const body = req.files[fileName];

    const files = Array.isArray(body) ? body : [body];

    if (files.length < 1) {
        throw new resUtil.CatchError({
            status: 400,
            message: "Please select at least one file to upload."
        })
    }
    files.forEach((file) => {
        if (!(Object.values(File.ImageType).includes(file.mimetype))) {
            throw new resUtil.CatchError({
                status: 400,
                message: "Image type is invalid"
            });
        } else if (file.size > File.ImageMaxSize) {
            throw new resUtil.CatchError({
                status: 400,
                message: "Maximum image size is 2MB"
            });
        } else if (!file.data) {
            throw new resUtil.CatchError({
                status: 400,
                message: "File data is invalid"
            });
        }
    });
    const data = await photoService.createPhotoCloud(fileName, files)

    return resUtil.success(res, {
        status: 200,
        message: "success",
        data
    });
})