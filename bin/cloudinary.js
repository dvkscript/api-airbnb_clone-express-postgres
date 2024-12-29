const { cloudinary } = require("../src/configs/cloudinary.config");

const deleteCloudinaryImage = async () => {
    await cloudinary.api.delete_resources_by_prefix("airbnb/", {
        resource_type: "image",
        invalidate: true,
        type: "upload",
    });
};

deleteCloudinaryImage();