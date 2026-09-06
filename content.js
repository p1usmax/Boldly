// ===== Bionic Reading — content.js =====
// This file does one job: find readable text on the page and bold
// the first part of each word. Nothing else touches the DOM.

// --- Config (will later come from popup + storage) ---
const CONFIG = {
  boldPercent: 0.5,      // 50% of each word gets bolded
  minWordLength: 3,      // skip short words like "a", "is"
  minBoldChars: 1,       // always bold at least this many letters
  skipTags: new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT',
    'CODE', 'PRE', 'SVG', 'CANVAS'
  ])
};

// --- Step 1: turn one word into bionic HTML ---
function bionicWord(word) {
  if (word.length < CONFIG.minWordLength) return word;

  let boldLength = Math.ceil(word.length * CONFIG.boldPercent);
  boldLength = Math.max(boldLength, CONFIG.minBoldChars);
  boldLength = Math.min(boldLength, word.length); // never exceed word length

  const boldPart = word.slice(0, boldLength);
  const restPart = word.slice(boldLength);

  return `<b>${boldPart}</b>${restPart}`;
}

// --- Step 2: turn a whole sentence/text chunk into bionic HTML ---
// Splits on whitespace boundaries but keeps the whitespace so
// formatting/spacing is untouched.
function bionicText(text) {
  return text.replace(/\S+/g, (word) => bionicWord(word));
}

// --- Step 3: decide whether a node should be skipped ---
function shouldSkip(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (CONFIG.skipTags.has(parent.tagName)) return true;
  if (parent.isContentEditable) return true;
  return false;
}

// --- Step 4: walk the DOM and transform text nodes in place ---
function transformPage(root = document.body) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let current;
  while ((current = walker.nextNode())) {
    textNodes.push(current);
  }

  // Replace each text node with a span containing the bionic HTML.
  // We do this in a second pass so we don't mutate the tree while walking it.
  for (const node of textNodes) {
    const span = document.createElement('span');
    span.className = 'bionic-reading-span';
    span.innerHTML = bionicText(node.nodeValue);
    node.parentNode.replaceChild(span, node);
  }
}

// Keep this around for manual console testing too.
window.__bionicTransformPage = transformPage;

// --- Step 5: auto-run on page load, based on saved settings ---
// Defaults used if nothing is saved yet.
const DEFAULT_SETTINGS = {
  enabled: true,
  boldPercent: 0.5
};

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  if (!settings.enabled) return; // user turned it off — do nothing

  CONFIG.boldPercent = settings.boldPercent;
  transformPage();
});
