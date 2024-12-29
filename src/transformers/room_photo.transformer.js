const Transformer = require("../../core/transformer");
const PhotoTransformer = require("./photo.transformer");

module.exports = class RoomPhotoTransformer extends Transformer {
    response(instance) {
        const photo = new PhotoTransformer(instance.photo, this.getRequest());
        
        return {
            id: instance.photo_id,
            position: instance.position,
            ...photo,
            created_at: instance.created_at,
            updated_at: instance.updated_at,
        }
    }
}