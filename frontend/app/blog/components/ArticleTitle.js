export default ({ article: { series, title }, titleOverride }) =>
  titleOverride
    ? titleOverride
    : series
      ? `${series.title}, Part ${series.part}: ${title}`
      : title
