module.exports = {
    key: "room-payment",
    async handle({ data }) {
        console.log(data,22222222222222);
    },
    workerOptions: {
        concurrency: 1,
    }
}