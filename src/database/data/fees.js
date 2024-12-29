const { v4: uuidv4 } = require("uuid");
module.exports = [
    {
        id: uuidv4(),
        country_code: "VN",
        app_fee: 0.03,
        service_fee: 0.14,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: uuidv4(),
        country_code: "US",
        app_fee: 0.04,
        service_fee: 0.192,
        created_at: new Date(),
        updated_at: new Date(),
    },
]