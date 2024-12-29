const photoRepository = require("../repositories/photo.repository");
const cloudinary = require("../configs/cloudinary.config");
const resUtil = require("../utils/res.util");
const Photo = require("../enums/photo");
const { sequelize } = require("../models")

class PhotoService {
    #repository = photoRepository;
    constructor() {};

    createPhoto(data) {
        return photoRepository.create(data);
    }
    async createPhotoCloud(fileName, files) {
        const uploadPublicId = [];
        try {
            return await sequelize.transaction(async (transaction) => {
                const uploadOptions = {
                    invalidate: true,
                    resource_type: "image",
                    secure: true,
                    overwrite: true,
                    folder: `airbnb/${fileName}`,
                };
                const uploadCloudPromises = files.map(file => {
                    return cloudinary.upload_stream(file.data, uploadOptions)
                });

                const uploadMultipleFiles = await Promise.all(uploadCloudPromises);

                const uploadMultipleValidate = uploadMultipleFiles.map(f => {
                    if (!f?.public_id) {
                        return null;
                    }
                    uploadPublicId.push(f.public_id)
                    return {
                        public_id: f.public_id,
                        format: f.format,
                    }
                }).filter(f => f);
                if (uploadMultipleValidate.length < 1) {
                    throw new resUtil.CatchError({
                        status: 500,
                        message: "Upload failed."
                    })
                }
                const photoPromises = uploadMultipleValidate.map(({ public_id, format }) => (
                    this.#repository.createPhoto({
                        url: public_id,
                        type: Photo.TYPE.CLOUD,
                        category: Photo.CATEGORY.OTHER,
                        format: format,
                    }, {transaction})
                ));

                const photoCreate = await Promise.all(photoPromises);

                const photoCreateFailed = photoCreate.findIndex(p => !p);

                if (photoCreateFailed !== -1) {
                    throw new resUtil.CatchError({
                        status: 500,
                        message: "Upload photo failed."
                    });
                }
                return photoCreate;
            });
        } catch (error) {
            if (uploadPublicId.length > 0) {
                await cloudinary.delete_by_public_id(uploadPublicId, {
                    resource_type: "image",
                    invalidate: true,
                    type: "upload",
                });
            }
            throw new resUtil.CatchError(error);
        }

    }
    async deletePhoto(ids) {
        const photos = await this.#repository.findAll({
            where: {
                id: ids,
            }
        });
        if (!photos) {
            throw new resUtil.CatchError({
                status: 500,
                message: "Server error"
            });
        }
        const cloudPublicIds = photos.filter(p => p.type === Photo.TYPE.CLOUD).map(p => p.url);
        if (cloudPublicIds.length > 0) {
            await cloudinary.delete_by_public_id(cloudPublicIds, {
                resource_type: "image",
                invalidate: true,
                type: "upload",
            });
        }
        const result = await this.#repository.delete({
            where: {
                id: photos.map(p => p.id).filter(p => p)
            }
        });
        return result;
    }
}

module.exports = new PhotoService();