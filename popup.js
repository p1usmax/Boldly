const DEFAULT_SETTINGS = {
  enabled: true,
  boldPercent: 0.5
};

const enabledToggle = document.getElementById('enabledToggle');
const intensitySlider = document.getElementById('intensitySlider');
const intensityValue = document.getElementById('intensityValue');

// Load current settings and reflect them in the UI.
chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  enabledToggle.checked = settings.enabled;
  intensitySlider.value = Math.round(settings.boldPercent * 100);
  intensityValue.textContent = `${intensitySlider.value}%`;
});

// Save on every change.
enabledToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});

intensitySlider.addEventListener('input', () => {
  intensityValue.textContent = `${intensitySlider.value}%`;
});

intensitySlider.addEventListener('change', () => {
  chrome.storage.sync.set({
    boldPercent: Number(intensitySlider.value) / 100
  });
});
