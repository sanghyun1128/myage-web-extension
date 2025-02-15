chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ birth: '' });
  chrome.storage.sync.set({ exam: 0 });
  chrome.storage.sync.set({ army: '' });
  chrome.storage.sync.set({ fast: false });
});
