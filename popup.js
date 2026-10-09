const DEFAULTS = { enabled: true, boldPercent: 0.5, blockedSites: [] };

const enabledToggle = document.getElementById('enabledToggle');
const slider = document.getElementById('intensitySlider');
const valueLabel = document.getElementById('intensityValue');
const siteBtn = document.getElementById('siteBtn');

const normHost = (h) => h.replace(/^www\./, '');
let host = null;
let blocked = [];

function renderSiteBtn() {
  if (!host) {
    siteBtn.textContent = 'Not available on this page';
    siteBtn.disabled = true;
    return;
  }
  siteBtn.disabled = false;
  const isBlocked = blocked.some((s) => normHost(s) === host);
  siteBtn.textContent = isBlocked ? `Turn on for ${host}` : `Turn off for ${host}`;
}

chrome.storage.local.get(DEFAULTS, (s) => {
  enabledToggle.checked = s.enabled;
  slider.value = Math.round(s.boldPercent * 100);
  valueLabel.textContent = `${slider.value}%`;
  blocked = s.blockedSites;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    try {
      const u = new URL(tabs[0].url);
      host = (u.protocol === 'http:' || u.protocol === 'https:') ? normHost(u.hostname) : null;
    } catch (e) {
      host = null;
    }
    renderSiteBtn();
  });
});

enabledToggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledToggle.checked });
});

slider.addEventListener('input', () => {
  valueLabel.textContent = `${slider.value}%`;
});
slider.addEventListener('change', () => {
  chrome.storage.local.set({ boldPercent: Number(slider.value) / 100 });
});

siteBtn.addEventListener('click', () => {
  if (!host) return;
  const isBlocked = blocked.some((s) => normHost(s) === host);
  blocked = isBlocked
    ? blocked.filter((s) => normHost(s) !== host)
    : [...blocked, host];
  chrome.storage.local.set({ blockedSites: blocked });
  renderSiteBtn();
});
