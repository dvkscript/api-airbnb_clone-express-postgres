const Transformer = require("../../core/transformer");
const PhotoTransformer = require("./photo.transformer");

module.exports = class StructureTransformer extends Transformer {
  response(instance) {
    const data = {
      id: instance.id,
      name: instance.name,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };
    if (instance.photo) {
      const { url } = new PhotoTransformer(instance.photo, this.getRequest());
      data.url = url;
    }
    return data;
  }
};
