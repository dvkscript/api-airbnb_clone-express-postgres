# syntax=docker/dockerfile:1

# Bắt đầu với image Node.js
FROM node:lts-alpine

# Đặt thư mục làm việc trong container
WORKDIR /api

# Copy toàn bộ mã nguồn của ứng dụng vào container
COPY . ./

# Sao chép file .env.development vào container và đổi tên thành .env
COPY .env.example ./.env

# Cài đặt các dependencies cần thiết cho dự án
RUN npm install --production

# Chạy lệnh seeder sau khi cài đặt dependencies
RUN npm run sequelize-setup

# Lệnh để start ứng dụng
CMD ["npm", "start"]

# Mở cổng 8080 cho ứng dụng
EXPOSE 8080
