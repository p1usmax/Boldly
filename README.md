# Boldly

A lightweight browser extension that bolds the beginning of each word on a webpage, giving your eyes a visual "anchor point" while reading. Aimed at people who find long text tiring to follow, including some people with ADHD or dyslexia.

## Features

- Bolds the start of every word (3+ letters) on any page
- Adjustable bold amount (20–70%), applied live — no reload needed
- Global on/off switch, plus **turn off for this site** when a site doesn't play nice
- Works on pages that load content later (infinite scroll, single-page apps)
- Leaves code blocks, `<pre>`, inputs and editable areas alone
- Numbers, punctuation and non-Latin scripts (e.g. Arabic) are left untouched
- No data collected, no network requests — settings stay in your browser

## Install

### Chrome / Brave / Edge
1. Open `chrome://extensions` (Brave: `brave://extensions`)
2. Turn on **Developer mode**
3. **Load unpacked** → select this folder
4. Pin Boldly from the puzzle-piece menu

### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → select `manifest.json` in this folder
3. If nothing happens on pages: `about:addons` → Boldly → **Permissions** → allow access to all sites

(Temporary add-ons are removed when Firefox closes. A permanent install needs the add-on published on addons.mozilla.org.)

## Known limitations

- Text inside `<pre>` blocks is skipped on purpose (it's usually code)
- Text inside Shadow DOM components and iframes isn't processed
- Some apps that re-render their own text (certain React/Vue UIs) can overwrite the bolding — use "Turn off for this site" if a site misbehaves
- Arabic, Hebrew, Indic and CJK text is not bolded, because splitting a connected word breaks its letter shapes

## A note on the research

This idea is commonly called "Bionic Reading", and the evidence is mixed:

- A small pilot study on people with Specific Learning Disorder (a category that includes dyslexia) reported better reading *accuracy* with bolded text, but it had no control group and a small sample.
- A larger eye-tracking study (Spear et al., 2025) found that bolding the first half of every word did **not** improve reading speed or eye movements compared with normal text, and in some conditions did worse. No specific group benefited.

Neither study is about ADHD specifically. Treat Boldly as a low-risk, unproven reading aid: it may help you and not someone else, which is why the amount is adjustable. Judge it by whether it helps *you* read.

## Files

```
manifest.json   extension config (Chrome + Firefox)
content.js      finds text and bolds word beginnings
styles.css      styling for the bold parts
popup.html/js   toggle, slider, per-site switch
icon*.png       icons
```

## License

Free to fork, modify and reuse.
