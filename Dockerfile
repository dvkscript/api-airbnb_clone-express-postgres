# syntax=docker/dockerfile:1

# Bắt đầu với image Node.js
FROM node:lts-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và yarn.lock để cài đặt dependencies trước
COPY package.json yarn.lock ./

# Cài đặt các dependencies cần thiết cho dự án
RUN yarn install --production

# Copy toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Chạy lệnh sequelize-setup sau khi cài đặt dependencies
RUN npm run sequelize-setup

# Lệnh để start ứng dụng
CMD ["npm", "start"]

# Mở cổng 8080 cho ứng dụng
EXPOSE 8080
