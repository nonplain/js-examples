---
title: Building our site data with nonplain
date: 2021-03-11
---

This site is built completely from JSON data. So, before we start generating our site, we need to get our data in order with a little help from some [`nonplain`](https://github.com/nonplain) tools.

## Notes2JSON with nonplain

`nonplain` and `nonplain-md-link` make building markdown notes into webpages simple by providing composable tools for parsing groups of "nonplain" (plaintext + fronmatter) files, transforming them as needed, and then exporting them. Loading the files, parsing them, transforming their body content and metadata, and exporting them to JSON is possible in just **60 lines** of code.

### The notes

First, we need a couple of files to build our site out of. You can do this yourself. For the purposes of this tutorial, make sure to create your files with a `title` property in the frontmatter:

```md
---
title: The title I want my page to be
---
```

Optionally, specify a permalink:

```md
---
title: This is the home page
permalink: /
---
```

This metadata will help us name our pages and navigate to them reliably on the web.

### The code

The full code can be found in the repo that contains this site, so you can go read the full `build-notes.js` file there. In the meantime, we'll walk through each section of that code and talk about what it does.

#### Dependencies

First, we need to import a few packages. We'll need the built-in Node.js `path` and `url` packages, as well as [`slug`](https://www.npmjs.com/package/slug), an excellent package from [Rich Trott](https://www.npmjs.com/package/slug) that makes valid permalinks easy. Finally, we'll import [`nonplain`](https://github.com/nonplain/nonplain.js) to help us work with our note files and [`nonplain-md-link`](https://github.com/nonplain/nonplain-md-link.js) to help us make sure our wiki-style links work on the web.

```js
const path = require('path');
const URL = require('url').URL;
const slug = require('slug');

const { Files } = require('nonplain');
const { Link, regex } = require('nonplain-md-link');
```

#### Helper functions

Next, we need two helper functions. One will help us detect URLs pointing to external sites so that we can treat them accordingly, and the other will use `nonplain-md-link` to transform all links in our markdown to work on our site, including "wiki-style" links.

First, our external URL detector:

```js
function isFullUrl(href) {
  try {
    new URL(href);
    return true;
  } catch (err) {
    return false;
  }
}
```

This function uses the built-in `url` package from Node.js to check whether a given string is a valid, full URL. If it is, we can assume it points to an external site. If it's not, we can assume it's a [relative path](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#absolute_urls_vs_relative_urls) and that it links to an internal page.

Now, we need to transform some links:

```js
function markdownLinksToHTML(content) {
  return content.replace(regex.links.all, (linkStr) => {
    const link = new Link(linkStr);

    const isExternalUrl = isFullUrl(link.path);

    if (isExternalUrl) {
      const externalLinkArrow = '&#x2197;';
      link.innerText = link.innerText + ' ' + externalLinkArrow;

      return link.composeHTML('rel="noreferrer" target="_blank"');
    } else {
      link.path = '/' + slug(path.parse(link.path).name) + '/';

      return link.composeHTML();
    }
  });
}
```

This function uses [`nonplain-md-link`](https://github.com/nonplain/nonplain-md-link.js) to [match](https://github.com/nonplain/nonplain-md-link.js#regex) and [parse](https://github.com/nonplain/nonplain-md-link.js#initialization) all links in our file [body](https://github.com/nonplain/nonplain.js#what-the-body-is-the-content). We'll call this function from within the [`transform()`](https://github.com/nonplain/nonplain.js#transforming-nonplain-file-data) method, passing the body of our file to it. This will ensure that all markdown and wiki-style links are working properly on our site.

#### Building notes

This is the fun part, where we put everything together using `nonplain.js`.

```js
(async () => {
  const print = console.log.bind(console, 'notes-build:');

  print('Building notes...');

  const files = await new Files().load('../notes/**/*.md');

  files.transform(({ body, metadata }) => {
    const newBody = markdownLinksToHTML(body);

    const newMetadata = {
      ...metadata,
      permalink: metadata.permalink || '/' + slug(metadata.title) + '/',
    };

    return {
      body: newBody,
      metadata: newMetadata,
    };
  });

  await files.export2JSON('src/_data/notes.json');

  print('Done!', '\n');
})();
```

This is a [self-calling function](https://stackoverflow.com/questions/7515293/what-are-self-calling-functions-in-javascript), so it runs when the file is executed by our `npm run notes` script. Inside this function, we print a message stating that notes are being built, load the notes into a `Files` instance to parse them, run a `transform()` on our files, export our files to JSON, and print a closing message.

To understand how this function works in more detail, see the links below:

- [Parsing files with `nonplain.js`](https://github.com/nonplain/nonplain.js#parsing-nonplain-files)
  ```js
  const files = await new Files().load('../notes/**/*.md');
  ```
- [Transforming file data with `nonplain.js`](https://github.com/nonplain/nonplain.js#transforming-nonplain-file-data)
  ```js
  files.transform(({ body, metadata }) => {
    const newBody = markdownLinksToHTML(body);

    const newMetadata = {
      ...metadata,
      permalink: metadata.permalink || slug(metadata.title),
    };

    return {
      body: newBody,
      metadata: newMetadata,
    };
  });
  ```
- [Exporting file data to JSON with `nonplain.js`](https://github.com/nonplain/nonplain.js#export2json)
  ```js
  await files.export2JSON('src/_data/notes.json');
  ```
  
Now, we can parse, transform, and export all of our note files by running this file.

```
$ node build-notes.js
```

When we put our site together, feel free to use [NPM scripts](https://docs.npmjs.com/cli/v6/using-npm/scripts) to make building as easy as `npm run notes`.

**Next:** [[Putting it all together with 11ty]]
