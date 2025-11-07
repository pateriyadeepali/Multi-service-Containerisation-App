# Stage 1: Flutter Build
FROM debian:bookworm-slim AS build

RUN apt-get update && apt-get install -y \
    curl git unzip xz-utils zip libglu1-mesa && \
    rm -rf /var/lib/apt/lists/*

# Install Flutter SDK
WORKDIR /flutter
RUN git clone https://github.com/flutter/flutter.git -b stable
ENV PATH="/flutter/flutter/bin:/flutter/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Verify installation
RUN flutter doctor -v

# Set working directory for the app
WORKDIR /app

# Copy all source files (force rebuild each time)
COPY . .

# Force Flutter to clean & rebuild every time
RUN flutter clean
RUN flutter pub get
RUN flutter build web --release --no-tree-shake-icons --verbose

# Stage 2: Nginx Server
FROM nginx:alpine

# Clear Nginx default HTML and copy new Flutter build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build/web /usr/share/nginx/html

# Expose port 80 for serving
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
