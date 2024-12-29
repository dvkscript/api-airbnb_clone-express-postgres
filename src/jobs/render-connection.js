const { default: axios } = require("axios");

module.exports = {
  key: "maintain-render-server-connection",
  async handle({ data }) {
    console.log(`Processing job to keep backend alive...`);
    const { url } = data;

    try {
      // Gửi yêu cầu đến backend
      const res = await axios.get(url);

      if (res.status === 200) {
        console.log("Server is alive and responding.");

        // Thêm job mới vào hàng đợi
      } else {
        console.error(`Failed to keep server alive. Status: ${res.status}`);
      }
    } catch (error) {
      console.error(`Error during HTTPS request: ${error.message}`);
    }
  },
};
