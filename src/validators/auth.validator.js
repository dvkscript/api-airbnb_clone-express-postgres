const yup = require("yup");
const AuthProvider = require("../enums/authProvider");

module.exports = {
  social: {
    full_name: yup.string().required('"full_name" is required'),
    email: yup.string().email().required('"email" is required'),
    thumbnail: yup.string().optional(),
    provider: yup
      .string()
      .required('"provider" is required')
      .equals([
        AuthProvider.LOCAL_ADMIN,
        AuthProvider.LOCAL_USER,
        AuthProvider.GOOGLE_ADMIN,
        AuthProvider.GOOGLE_USER,
        AuthProvider.GITHUB_ADMIN,
        AuthProvider.GITHUB_USER,
      ]),
  },
  local: {
    email: yup.string().email("Invalid email").required('"email" is required'),
    password: yup.string().required('"password" is required'),
  },
  signUp: {
    full_name: yup.string().required('"full_name" is required').min(3, {
      message: '"full_name" must be at least 3 characters',
    }),
    email: yup.string().email("Invalid email").required('"email" is required'),
    password: yup
      .string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
    re_password: yup
      .string()
      .oneOf([yup.ref("password"), null], 'Must match "password" field value'),
  },
  refreshToken: {
    refresh_token: yup.string().required('refresh_token is required')
  }
};
