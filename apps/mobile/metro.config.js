// Expo tự cấu hình monorepo (npm workspaces). File này để các team mở rộng khi cần.
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
