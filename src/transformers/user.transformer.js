const Transformer = require("../../core/transformer");
const PhotoTransformer = require("./photo.transformer");
const RoomPhotoTransformer = require("./room_photo.transformer");
const StructureTransformer = require("./structure.transformer");

class UserRoomTransformer extends Transformer {
  response(instance) {
    const req = this.getRequest();
    instance = instance.get({ plain: true });

    const structure = instance.structure;
    const photos = instance.photos;
    const discounts = instance.discounts;
    const fee = instance.fee;

    const data = {
      id: instance.id,
      title: instance.title,
      description: instance.description,
      statusText: instance.statusText,
      instant_book: instance.instant_book,
      original_price: +instance.original_price,
      structure,
      privacy_type: instance.privacy_type,
      address: instance.address,
      amenities: instance.amenities,
      fee,
      discounts,
      floorPlan: instance.floorPlan,
      photos,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };

    if (structure) {
      data.structure = new StructureTransformer(structure, req);
    }

    if (photos.length > 0) {
      data.photos = new RoomPhotoTransformer(photos, req);
    }

    if (fee) {
      data.fee = {
        ...fee,
        app_fee: fee.app_fee,
        service_fee: fee.service_fee,
      };
    }

    if (discounts.length > 1) {
      data.discounts = discounts.map((d) => ({ ...d, percent: +d.percent }));
    }

    return data;
  }
}

class UserWishlistTransformer extends Transformer {
  response(instance) {
    const req = this.getRequest();
    instance = instance.get({ plain: true });

    const room = instance.rooms[0] || null;

    const data = {
      id: instance.id,
      name: instance.name,
      thumbnail: null,
      roomCount: instance.rooms.length,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };

    if (room && room.photos[0]) {
      data.thumbnail = new PhotoTransformer(room.photos[0].photo, req).url;
    }

    return data;
  }
}

module.exports = {
  UserRoomTransformer,
  UserWishlistTransformer,
};
