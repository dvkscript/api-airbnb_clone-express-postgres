require("dotenv").config();
const cloudinaryV2 = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload_stream = async (file, options) => {
    return new Promise((resolve, reject) => {
        const cloudStream = cloudinaryV2.uploader.upload_stream(
            options,
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            }
        );
        const str = Readable.from(file);
        str.pipe(cloudStream);
    });
};

const delete_by_public_id = async (public_id, option) => {
    return await cloudinaryV2.api.delete_resources(public_id, option);
};

const delete_by_folder = async (folder, option) => {
    if (!folder) {
        throw new Error("Folder is required");
    }
    folder = `airbnb/${folder}/`;
    return await cloudinaryV2.api.delete_resources_by_prefix(folder, option);
};

const cloudinary = {
    ...cloudinaryV2.uploader,
    upload_stream,
    delete_by_public_id,
    delete_by_folder,
    cloudinary: cloudinaryV2
}
module.exports = cloudinary;