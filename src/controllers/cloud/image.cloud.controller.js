const resUtil = require("../../utils/res.util");
const path = require("path");

module.exports = resUtil.catchError(async (req, res, next) => {
  const cloudUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const { publicId } = req.params;

  const pathname = [req.params[0], publicId].filter((p) => p).join("/");
  const fullUrl = cloudUrl + `/${pathname}`;
  
  const fetch = (await import('node-fetch')).default;

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Properly set the headers
    },
  });
  if (!response.ok) {
    const defaultImagePath = path.join(__dirname, "../../../public/images/not-found.jpg");
    return res.sendFile(defaultImagePath);
  }
  return response.body.pipe(res);
});
