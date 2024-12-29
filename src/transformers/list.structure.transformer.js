const Transformer = require("../../core/transformer");

class ListStructureTransformer extends Transformer {
  //Định nghĩa dữ liệu trả về của API
  response(instance) {
    const photo = instance.photo
      ? instance.photo.get({ plain: true })
      : null;

    return {
      id: instance.id,
      name: instance.name,
      photo,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };
  }
}

module.exports = ListStructureTransformer;
