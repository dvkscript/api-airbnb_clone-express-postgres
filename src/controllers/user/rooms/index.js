const get = require("./get");
const post = require("./post");
const _delete = require("./delete");

const userRoomsController = {
    get,
    post,
    delete: _delete
}

module.exports = userRoomsController;