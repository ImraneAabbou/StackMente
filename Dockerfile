# =============================
# Stage 1: Composer dependencies
# =============================
FROM composer:2 AS php-deps

WORKDIR /app

# Copy only necessary files
COPY composer.json ./

# Install only production dependencies
RUN composer install --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist

# =============================
# Stage 2: Frontend build
# =============================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy frontend source files
COPY resources/ ./resources
COPY lang/ ./lang
COPY vite.config.js tsconfig.json tailwind.config.js postcss.config.js package*.json ./

# Copy vendor from Composer stage
COPY --from=php-deps /app/vendor ./vendor

# Install npm deps
RUN npm clean-install

# Build frontend
RUN npm run build

# =============================
# Stage 3: PHP runtime app
# =============================
FROM php:8.4-fpm-alpine AS runner

WORKDIR /app

# Install extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions

# Install required PHP extensions (no need for manual apk or docker-php-ext*)
RUN install-php-extensions pdo pdo_mysql zip gd

# Copy app source
COPY composer.json .
COPY artisan .
COPY routes ./routes
COPY app ./app
COPY public ./public
COPY lang ./lang
COPY config ./config
COPY bootstrap ./bootstrap
COPY database ./database
COPY resources ./resources/
COPY storage ./storage/

RUN rm -rf ./resources/js/ ./resources/css/

# Copy vendor from Composer stage
COPY --from=php-deps /app/vendor ./vendor

# Copy built frontend from Node stage
COPY --from=frontend-builder /app/public/build ./public/build

# Clean frontend source if needed
RUN rm -rf node_modules resources/js


RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

RUN apk add --no-cache bash

ENTRYPOINT sh -c "\
php artisan config:cache && php artisan event:cache && php artisan view:cache && \
wait-for-it.sh ${DB_HOST}:3306 --timeout=30 --strict && \
php artisan migrate --force --seed ; \
php artisan serve --host=0.0.0.0 --port=80"
