# Boldly

A lightweight browser extension that bolds the beginning of each word on a webpage, giving your eyes a visual "anchor point" to help guide reading — useful for people who find long text tiring or hard to stay focused on, including some people with ADHD or reading difficulties.

## What it does

- Automatically bolds roughly the first half of every word (3+ letters) on any page you visit
- Adjustable intensity slider — tune how much of each word gets bolded
- One-click on/off toggle
- Doesn't touch page structure, links, or functionality — only the visual weight of text

## Installation (unpacked / developer mode)

1. Download this folder to your computer
2. Open your browser's extensions page 
3. Turn on **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select this folder
6. Pin the extension to your toolbar (click the puzzle-piece icon → pin "Boldly")

## Usage

Click the Boldly icon in your toolbar to:
- Toggle it on/off
- Adjust the bold intensity (how much of each word gets bolded)

Reload the current page after changing settings for them to take effect.

## A note on the research

This idea is commonly known as "Bionic Reading." It's worth being upfront about what the actual evidence says, since it's mixed:

- A small 2026 pilot study on people with Specific Learning Disorder (a category that includes dyslexia) found improved reading *accuracy* with bolded text — but had no control group and a small sample.
- A more rigorous 2025 eye-tracking study found that bolding the first half of every word did **not** improve reading speed or eye movements over normal text, and in some cases performed *worse* than unbolded text. It also found no benefit for any specific group tested.


**In short:** this is a genuinely unproven but low-risk reading aid. It might work well for you and not for someone else — that's exactly why intensity is adjustable rather than fixed. Try it, tune it, and judge by whether it actually helps *you* read, not by an assumption that it's scientifically settled.

## Project structure

```
manifest.json    — extension configuration
content.js       — core logic: finds text on the page and bolds word beginnings
styles.css       — minimal styling so the transform doesn't break page layout
popup.html/js    — the toggle + intensity slider UI
icon16/48/128.png — extension icon
```

## License

Feel free to fork, modify, and reuse.
