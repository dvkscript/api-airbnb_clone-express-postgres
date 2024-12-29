const Transformer = require("../../core/transformer");

class ProfileTransformer extends Transformer {
  //Định nghĩa dữ liệu trả về của API
  response(instance) {
    if (!Array.isArray(instance.roles)) {
      instance.roles = [];
    }
    if (!Array.isArray(instance.permissions)) {
      instance.permissions = [];
    }
    const roles = instance.roles.map((r) => r.name);
    const rolePermissions = instance.roles.flatMap((r) => {
      if (!Array.isArray(r.permissions)) {
        return [];
      }
      return r.permissions.map((p) => p.value);
    });
    const userPermission = instance.permissions.map((item) => item.value);
    const permissions = [...new Set([...rolePermissions, ...userPermission])];

    const profile = instance.profile
      ? instance.profile.get({ plain: true })
      : null;

    return {
      id: instance.id,
      full_name: instance.full_name,
      email: instance.email,
      status: instance.status,
      profile,
      roles,
      permissions,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };
  }
}

module.exports = ProfileTransformer;
