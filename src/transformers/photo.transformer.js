const Transformer = require("../../core/transformer");
const resUtil = require("../utils/res.util");

module.exports = class PhotoTransformer extends Transformer {
  response(instance) {
    const photo = instance
      ? (instance?.get ? instance.get({ plain: true }) : instance)
      : null;

    const url = resUtil.imageParse(this.getRequest(), photo);
    
    return { url };
  }
};
