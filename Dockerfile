# syntax=docker/dockerfile:1

FROM node:lts-alpine

WORKDIR /app

# Copy các tệp của bạn vào trong container
COPY . .

# Cài đặt dependencies
RUN yarn install --production

# Chạy lệnh seeder sau khi cài đặt dependencies
RUN npx sequelize db:seed:all

# Lệnh để start ứng dụng
CMD ["npm", "start"]

# Mở cổng ứng dụng
EXPOSE 8080
