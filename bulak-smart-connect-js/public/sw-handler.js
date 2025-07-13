// Service Worker message handler for skip waiting
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      // Service worker has been updated and is ready
      window.location.reload();
    }
  });
}