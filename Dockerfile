# syntax=docker/dockerfile:1

# Bắt đầu với image Node.js
FROM node:lts-alpine

# Đặt thư mục làm việc trong container
WORKDIR /api

# Copy toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Cài đặt các dependencies cần thiết cho dự án
RUN npm install --production

# Lệnh để start ứng dụng
CMD ["npm", "start"]

# Mở cổng 8080 cho ứng dụng
EXPOSE 8080
