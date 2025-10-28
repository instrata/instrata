# Installation

## Linux

You will need the following system packages:
```shell
sudo apt update
# library:tauri
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
# library:xcap  // for screenshot capabilities
sudo apt-get install -y \
  pkg-config \
  libclang-dev \
  libxcb1-dev \
  libxrandr-dev \
  libdbus-1-dev \
  libpipewire-0.3-dev \
  libwayland-dev \
  libegl-dev \
  libgbm-dev
```
