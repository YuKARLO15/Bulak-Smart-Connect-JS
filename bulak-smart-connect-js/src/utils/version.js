// Generate build timestamp
export const BUILD_TIMESTAMP = Date.now();
export const BUILD_DATE = new Date().toISOString();
export const VERSION = `v${new Date().toISOString().slice(0, 10)}-${BUILD_TIMESTAMP}`;

// Log version info
console.log(`🏛️ Bulak Smart Connect ${VERSION}`);
console.log(`📅 Built: ${BUILD_DATE}`);

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.APP_VERSION = VERSION;
  window.BUILD_TIMESTAMP = BUILD_TIMESTAMP;
}