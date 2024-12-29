const { sequelize } = require("../models");
const Permission = require("../enums/permission");
const userRepository = require("../repositories/user.repository");
const providerRepository = require("../repositories/provider.repository");
const photoRepository = require("../repositories/photo.repository");
const jwtUtil = require("../utils/jwt.util");
const Photo = require("../enums/photo");
const bcrypt = require("bcrypt");
const resUtil = require("../utils/res.util");

module.exports = {
  socialAdmin: async (body) => {
    return await sequelize.transaction(async (t) => {
      const user = await userRepository.getUserProfile(
        {
          email: body.email,
        },
        {
          transaction: t,
        }
      );

      if (!user) {
        throw new resUtil.CatchError({
          status: 403,
          message: "Forbidden",
        });
      }
      const permissions = user.permissions;

      if (!permissions.includes(Permission.ADMIN_ACCESS)) {
        throw new resUtil.CatchError({
          status: 403,
          message: "Forbidden",
        });
      }

      const accessToken = jwtUtil.admin.createAccessToken({ userId: user.id });
      const refreshToken = jwtUtil.admin.createRefreshToken();
      const [[provider]] = await Promise.all([
        providerRepository.getProviderOrCreate(
          {
            name: body.provider,
          },
          {
            name: body.provider,
          },
          {
            transaction: t,
          }
        ),
        user.createToken(
          {
            refresh_token: refreshToken,
          },
          {
            transaction: t,
          }
        ),
      ]);

      if (!provider) {
        throw new resUtil.CatchError({
          status: 500,
          message: "Internal server error",
        });
      }
      await user.addProvider(provider, {
        transaction: t,
      });
      return {
        accessToken,
        refreshToken,
      };
    });
  },
  socialUser: async (body) => {
    return await sequelize.transaction(async (t) => {
      const { provider, thumbnail, ...rest } = body;
      const userBody = {
        ...rest,
      };
      const refreshToken = jwtUtil.user.createRefreshToken();

      const [user, isCreated] = await userRepository.getUserOrCreate(
        userBody,
        {
          email: body.email,
        },
        {
          transaction: t,
        }
      );
      if (!user) {
        throw new resUtil.CatchError({
          status: 500,
          message: "Internal server error",
        });
      }

      const accessToken = jwtUtil.user.createAccessToken({ userId: user.id });

      const [[providerData], profile] = await Promise.all([
        providerRepository.getProviderOrCreate(
          {
            name: provider,
          },
          {
            name: provider,
          },
          {
            transaction: t,
          }
        ),
        isCreated && user.createProfile({}, { transaction: t }),
        user.createToken({ refresh_token: refreshToken }, { transaction: t })
      ]);

      if (profile) {
        const thumbnailCreated = await photoRepository.createPhoto({
          url: thumbnail,
          type: Photo.TYPE.URL,
          category: Photo.CATEGORY.THUMBNAIL,
        }, { transaction: t });

        if (!thumbnailCreated) {
          throw new resUtil.CatchError({
            status: 500,
            message: "Internal server error",
          });
        }

        await profile.setThumbnail(thumbnailCreated.id, { transaction: t });
      }

      await user.addProvider(providerData.id, {
        transaction: t,
      });

      const token = {
        accessToken,
        refreshToken,
      };

      return token;
    });
  },
  localAdmin: async (userId, provider) => {
    return await sequelize.transaction(async (t) => {
      const accessToken = jwtUtil.admin.createAccessToken({ userId });
      const refreshToken = jwtUtil.admin.createRefreshToken();

      const [user, [providerData]] = await Promise.all([
        userRepository.getUser(
          {
            id: userId,
          },
          {
            transaction: t,
          }
        ),
        providerRepository.getProviderOrCreate(
          {
            name: provider,
          },
          {
            name: provider,
          },
          {
            transaction: t,
          }
        ),
      ]);
      if (!user) {
        throw new resUtil.CatchError({
          status: 404,
          message: "User not found",
        });
      }
      await Promise.all([
        user.createToken(
          {
            refresh_token: refreshToken,
          },
          {
            transaction: t,
          }
        ),
        user.addProvider(providerData, {
          transaction: t,
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    });
  },
  localUser: async (userId, provider) => {
    return await sequelize.transaction(async (t) => {
      const accessToken = jwtUtil.user.createAccessToken({ userId });
      const refreshToken = jwtUtil.user.createRefreshToken();

      const [user, [providerData]] = await Promise.all([
        userRepository.getUser(
          {
            id: userId,
          },
          {
            transaction: t,
          }
        ),
        providerRepository.getProviderOrCreate(
          {
            name: provider,
          },
          {
            name: provider,
          },
          {
            transaction: t,
          }
        ),
      ]);
      if (!user) {
        throw new resUtil.CatchError({
          status: 404,
          message: "User not found",
        });
      }
      await Promise.all([
        user.createToken(
          {
            refresh_token: refreshToken,
          },
          {
            transaction: t,
          }
        ),
        user.addProvider(providerData, {
          transaction: t,
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    });
  },
  signUp: async (body) => {
    body.profile = {}
    delete body.refresh_token;
    body.password = bcrypt.hashSync(body.password, 10);
    const [user, isUserCreated] = await userRepository.getUserOrCreate(body, {
      email: body.email,
    });

    if (!user) {
      throw new resUtil.CatchError({
        status: 500,
        message: "Internal server error",
      });
    }
    if (!isUserCreated) {
      throw new resUtil.CatchError({
        status: 409,
        message: "User already exists",
      });
    }
    return {
      id: user.id,
    };
  },
};
