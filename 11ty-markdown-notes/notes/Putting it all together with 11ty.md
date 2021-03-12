---
title: Putting it all together with 11ty
date: 2021-03-11
---

**Note:** if you haven't read [part 1](Building site data with nonplain.md) of this guide, go read that first!

---

Now that we've exported our files to JSON, we can take advantage of 11ty's pagination feature to [create pages from our data](https://www.11ty.dev/docs/pages-from-data/).

To get everything working, we just need to:

- [Install 11ty](https://www.11ty.dev/docs/getting-started/)
- [Add our JSON data to 11ty](https://www.11ty.dev/docs/data-global/)
- [Build pages from our JSON data](https://www.11ty.dev/docs/pages-from-data/)
- [Compute page titles for each file](https://www.11ty.dev/docs/data-computed/)
- **Optional:** Create a basic [layout](https://www.11ty.dev/docs/layouts/) to make our site look nice

Here's what our site's files will look like when we're done:

```
site/
├─ .eleventy.js
├─ build-notes.js
├─ src/
│  ├─ site-pages.njk
│  ├─ _data/
│  │  ├─ eleventyComputed.js
│  │  ├─ notes.json
│  ├─ _layouts/
│  │  ├─ base.njk
```

## Install 11ty

First, create a directory to contain your 11ty site and install 11ty.

Then, create an `.eleventy.js` configuration file in the root of your project so that 11ty knows where your site's source code lives.

`.eleventy.js`:

```js
module.exports = {
  dir: {
    input: 'src',
  },
};
```

Once that's all done, we can begin building.

## Building pages from our JSON data

To [build our pages from our JSON data](https://www.11ty.dev/docs/pages-from-data/), we'll take advantage of 11ty's pagination feature.

First, we'll create a `.njk` [template](https://www.11ty.dev/docs/languages/nunjucks/) at `src/site-pages.njk` to tell 11ty how to paginate our data.

`src/site-pages.njk`:

{% raw %}
```js
---js
{
  pagination: {
      data: 'notes',
      size: 1,
      alias: 'note',
  },
  permalink: '/{{ note.metadata.permalink }}/',
  templateEngineOverride: 'njk, md',
}
---

# {{ note.metadata.title | safe }}

{{ note.body | safe }}
```
{% endraw %}

This file tells 11ty to paginate the "`notes`" data one record at a time, aliasing each record as `note` so that we can reference it from within the template. It also supplies each note's `metadata.permalink` property (added in `transform()`) to 11ty so that our pages show up at the right URLs.

Finally, we use [`templateEngineOverride`](https://www.11ty.dev/docs/languages/#overriding-the-template-language) to tell 11ty to process this file first as a nunjucks template, and then as a markdown template. This is because we are injecting each note's `metadata.title` and `body` into the template, so we need the template to be built before the markdown in our note is processed.

## Add JSON data to 11ty

As for how we get our JSON data to show up as `notes` in 11ty, you may have noticed that our `files.export2JSON()` call took a filepath as an argument. This is the filepath to 11ty's default [global data](https://www.11ty.dev/docs/data-global/) directory. We export our JSON file to this directory so that 11ty has access to the data. Once the JSON file exists in our site's `_data` directory, 11ty lets us access the data via its filename.

## Compute page titles

Once our `notes.json` file has been compiled and exported to `src/_data`, we just need to make sure our webpages will have the correct titles. We can hoist each note file's `metadata.title` property to the top level of each page's data using 11ty's [computed data](https://www.11ty.dev/docs/data-computed/) feature.

`src/_data/eleventyComputed.js`:

```js
module.exports = {
  title: data => data.note
    ? data.note.metadata.title
    : data.title,
};
```

Now, 11ty will use our JSON data to create all of our pages, with correct page titles.

## Making things look nice with a layout

Our site should be working at this point! 🎉 However, it probably looks pretty bland. To take it up a notch, add a [layout template](https://www.11ty.dev/docs/layouts/) to your site to wrap each page's content. You can check out the `src/_layouts/base.njk` file in the repo for this site if you'd like to see how this one was done, but here's a quick overview.

First, create a layout template at `src/_layouts` (or `src/_includes`). A simple layout template might look like this:

`src/_layouts/base.njk`:

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{- title | safe -}}</title>
    
    <style>
      /* Add some CSS to make everything look nice */
    </style>
  </head>
  <body>
    <main>
      {{ content | safe }}
    </main>
  </body>
</html>
```

Then, make sure 11ty can see your layouts by adding the `_layouts` directory to your `.eleventy.js` configuration:

`.eleventy.js`:

```js
module.exports = {
  dir: {
    input: 'src',
    layouts: '_layouts',
  },
};
```

Finally, make sure 11ty knows that you want your generated pages to use this layout by adding it to the frontmatter of your `site-pages.njk` template:

`src/site-pages.njk`:

{% raw %}
```js
---js
{
  layout: 'base.njk',
  pagination: {
      data: 'notes',
      size: 1,
      alias: 'note',
  },
  permalink: '/{{ note.metadata.permalink }}/',
  templateEngineOverride: 'njk, md',
}
---

# {{ note.metadata.title | safe }}

{{ note.body | safe }}
```
{% endraw %}

## That's it!

Now gaze upon your glorious new web notes! ✨
