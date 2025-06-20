chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      birth: '',
      exam: '0',
      army: '',
      fast: false,
    });
  }
});
