---
title: nonplain + 11ty = web notes
date: 2021-03-11
permalink: /
---

This site was made by exporting markdown notes to JSON with [**nonplain.js**](https://github.com/nonplain/nonplain.js) and then using that data to generate webpages with [**11ty**](https://www.11ty.dev/).

The result is a lightning-fast JAMstack website built entirely from markdown notes 🤓

## A few stats

- This entire site is built from just **180 lines of code**, including whitespace and JSON data
- It took just **30 minutes** to put this site together, from start to finish
- This page weighs just **~2kb**
- This site is **accessible**, **mobile-friendly**, and **cool**

## A few features

- **Automatic external links.** See all those links with "&#x2197;" next to them? Those are external links. External links automatically open in new tabs, just like they should, thanks to [`nonplain-md-link`](https://github.com/nonplain/nonplain-md-link.js).
- **Valid permalinks**. No unexpected `404`s here. All note titles are turned into valid permalinks and then injected into each note's metadata via [`transform()`](https://github.com/nonplain/nonplain.js#transforming-nonplain-file-data).
- **Easy development cycle.** Just write notes, build, and deploy.

## Do it yourself

- **[[How to make this site]]:**
  1. [[Building our site data with nonplain]]
  2. [[Putting it all together with 11ty]]

<div style="display: flex; flex-direction: row; margin-top: 36px;">
  <span style="font-size: 1.5em; margin-right: 9px;">👉</span>
  <span>To see this concept implemented on a live website, check out [jaredgorski.org/notes](https://jaredgorski.org/notes).</span>
</div>
