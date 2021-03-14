const path = require('path');
const URL = require('url').URL;
const slug = require('slug');

const Files = require('nonplain').default;
const Link = require('nonplain-md-link').default;
const { regex } = require('nonplain-md-link');

function isFullUrl(href) {
  try {
    new URL(href);
    return true;
  } catch (err) {
    return false;
  }
}

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

const print = console.log.bind(console, 'notes-build:');

print('Building notes...');

const files = new Files().load('../notes/**/*.md');

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

files.export2JSON('src/_data/notes.json');

print('Done!', '\n');
