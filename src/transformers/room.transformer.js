const Transformer = require("../../core/transformer");
const resUtil = require("../utils/res.util");
const PhotoTransformer = require("./photo.transformer");
const RoomPhotoTransformer = require("./room_photo.transformer");

class RoomListTransformer extends Transformer {
  response(instance) {
    const req = this.getRequest();
    instance = instance.get({ plain: true });

    const photos = instance.photos;
    const address = instance.address;
    const wishlists = instance?.wishlists?.[0] || null;
    const structure = instance.structure;

    const result = {
      id: instance.id,
      title: instance.title,
      description: instance.description,
      statusText: instance.statusText,
      original_price: +instance.original_price,
      address,
      photos,
      wishlists,
      structure,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };

    if (photos.length > 0) {
      result.photos = new RoomPhotoTransformer(photos, req);
    }
    if (structure) {
      result.structure = structure.name;
    }

    return result;
  }
}

class RoomDetailTransformer extends Transformer {
  response(instance) {
    const req = this.getRequest();
    instance = instance.get({ plain: true });

    const structure = instance.structure;
    const photos = instance.photos || [];
    const discounts = instance.discounts;
    const fee = instance.fee;
    const wishlists = instance?.wishlists?.[0] || null;

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
      amenities: instance.amenities.map((a) => a.id),
      fee,
      discounts,
      floor_plan: instance.floor_plan,
      photos,
      wishlists,
      floorPlan: instance.floorPlan,
      user: instance.user,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };

    if (data.user) {
      const user = {
        thumbnail: null,
        full_name: data.user.full_name,
        exp: 0,
      };
      if (data.user.rooms[0]) {
        user.exp = new Date() - new Date(data.user.rooms[0].created_at);
      } else {
        user.exp = new Date() - new Date(instance.created_at);
      }

      if (data.user?.profile?.thumbnail) {
        const { url } = new PhotoTransformer(
          data.user?.profile?.thumbnail,
          req
        );
        user.thumbnail = url;
      }
      data.user = user;
    }

    if (structure) {
      data.structure = structure.name;
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

class UserRoomListTransformer extends Transformer {
  response(instance) {
    const req = this.getRequest();
    instance = instance.get({ plain: true });

    const photos = instance.photos;
    const address = instance.address;

    const result = {
      id: instance.id,
      title: instance.title,
      description: instance.description,
      statusText: instance.statusText,
      original_price: +instance.original_price,
      address,
      photos,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };

    if (photos.length > 0) {
      result.photos = photos.map((p) => {
        const photo = p.photo;
        delete p.photo;

        return {
          ...p,
          url: resUtil.imageParse(req, photo),
        };
      });
    }

    return result;
  }
}

module.exports = {
  RoomListTransformer,
  RoomDetailTransformer,
  UserRoomListTransformer,
};
