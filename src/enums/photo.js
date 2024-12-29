const Photo = Object.freeze({
  TYPE: Object.freeze({
    URL: "URL",
    CLOUD: "CLOUD",
    LOCAL: "LOCAL",
  }),
  FORMAT: Object.freeze({
    JPG: "jpg",
    PNG: "png",
    JPEG: "jpeg",
    GIF: "gif",
  }),
  CATEGORY: Object.freeze({
    THUMBNAIL: "THUMBNAIL",
    BACKGROUND: "BACKGROUND",
    ICON: "ICON",
    BANNER: "BANNER",
    OTHER: "OTHER",
    ROOM: "ROOM",
  }),
});

module.exports = Photo;
