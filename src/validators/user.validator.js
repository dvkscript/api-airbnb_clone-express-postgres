const yup = require("yup");
const { PRIVACY_TYPE } = require("../enums/room");

module.exports = {
  rooms: {
    post: {
      title: yup.string().optional(),
      description: yup.string().optional(),
      original_price: yup
        .number()
        .min(1, {
          message: '"base_price" must be greater than 0',
        })
        .optional(),
      statusText: yup.string().optional(),
    },
    delete: {
      ids: yup.array().of(yup.string()).min(1),
    },
    patch: {
      common: {
        roomId: yup
          .string()
          .uuid("roomId is invalid")
          .required("roomId is required"),
        title: yup
          .string()
          .min(1, {
            message: `"title" minimum 1 character required`
          })
          .max(32, {
            message: '"title" must be at least 3 characters',
          })
          .optional(),
        description: yup
          .string()
          .max(500, {
            message: '"description" must be at least 5 characters',
          })
          .optional(),
        instant_book: yup.boolean().optional(),
        original_price: yup
          .number()
          .min(10, {
            message: '"base_price" must be greater than 0',
          })
          .optional(),
        structure_id: yup.string().optional(),
        privacy_type: yup
          .string()
          .equals([PRIVACY_TYPE.ENTIRE, PRIVACY_TYPE.ROOM, PRIVACY_TYPE.SHARED])
          .optional(),
        amenity_id: yup.array().of(yup.string()).optional(),
        photos: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required(),
              position: yup.number().optional(),
            })
          )
          .optional(),
        discounts: yup
          .array()
          .of(
            yup.object({
              percent: yup.number().required("'percent' is required"),
              conditions: yup
                .string()
                .required("Conditions is required")
                .min(3, {
                  message: '"Conditions" must be at least 3 characters',
                }),
            })
          )
          .optional(),
      },
      address: {
        postal_code: yup
          .string()
          .required("Postal_code is required")
          .min(5, {
            message: "Postal_code must be at least 5 characters",
          })
          .optional(),
        extras: yup
          .string()
          .required("Extras is required")
          .min(3, {
            message: "Extras must be at least 3 characters",
          })
          .optional(),
        street: yup.string().required("Street is required").min(3, {
          message: "Street must be at least 3 characters",
        }),
        district: yup.string().required("District is required").min(3, {
          message: "District must be at least 3 characters",
        }),
        province: yup.string().required("Province is required").min(3, {
          message: "Province must be at least 3 characters",
        }),
        country: yup.string().required("Country is required").min(2, {
          message: "Country must be at least 2 characters",
        }),
        country_code: yup
          .string()
          .required("Country is required")
          .min(2, {
            message: "country_code must be at least 2 characters",
          })
          .max(3, {
            message: "country_code maximum 3 characters",
          }),
        lat: yup
          .number()
          .required("Lat is required")
          .typeError("Lat must be a number"),
        lng: yup
          .number()
          .required("Lng is required")
          .typeError("Lng must be a number"),
      },
      floorPlan: {
        guests: yup
          .number()
          .required("Guests is required")
          .typeError("Guests must be a number")
          .min(1, {
            message: "Guests must be at least 1",
          })
          .max(16, {
            message: "Guests maximum 16",
          }),
        bedrooms: yup
          .number()
          .required("Bedrooms is required")
          .typeError("Bedrooms must be a number")
          .min(0, {
            message: "Bedrooms must be at least 0",
          })
          .max(50, {
            message: "Bedrooms maximum 50",
          }),
        bathrooms: yup
          .number()
          .required("Bathrooms is required")
          .typeError("Bathrooms must be a number")
          .min(0.5, {
            message: "Bathrooms must be at least 0.5",
          })
          .max(50, {
            message: "Bathrooms maximum 50",
          }),
        beds: yup
          .number()
          .required("Beds is required")
          .typeError("Beds must be a number")
          .min(1, {
            message: "Beds must be at least 1",
          })
          .max(50, {
            message: "Beds maximum 50",
          }),
      },
    },
  },
  favorites: {
    post: {
      name: yup.string().required('"name" is required').min(1, {
        message: '"name" must be at least 2 characters',
      }),
    },
  },
  wishlists: {
    "[wishlistId]": {
      post: {
        roomId: yup.string().required('"roomId" is required'),
        action: yup.string().equals(["add", "remove"]).required('"action" is required')
      }
    }
  }
};
