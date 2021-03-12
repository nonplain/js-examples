module.exports = {
  title: data => data.note
    ? data.note.metadata.title
    : data.title,
};
