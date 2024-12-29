const Transformer = require("../../core/transformer");
const PhotoTransformer = require("./photo.transformer");

class AmenityListTransformer extends Transformer {
    response(instance) {
        instance = instance.get({ plain: true });

        const req = this.getRequest();

        if (!req) {
            throw new Error("req in transformer not found");
            
        }
        
        const { url } = new PhotoTransformer(instance.photo, req);

        return {
            id: instance.id,
            name: instance.name,
            url,
            category: instance.category,
            created_at: instance.created_at,
            updated_at: instance.updated_at,
        };
    }
}

module.exports = {
    AmenityListTransformer
};
