const yup = require("yup");

module.exports = {
    delete: {
        ids: yup.array().of(yup.string().required()),
    }
}