FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install Electron dependencies and Xvfb
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    xvfb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
