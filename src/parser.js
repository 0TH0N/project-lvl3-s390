

export default (data) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data, 'application/xml');
  // throw error when "data" is not XML-RSS data
  if (!dom.querySelector('rss')) {
    throw new Error('This address is not RSS feed.');
  }
  // Get articles from DOM
  const items = dom.querySelectorAll('item');
  const articles = [];
  items.forEach((el) => {
    const article = {
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
    };
    articles.push(article);
  });
  // Make feed with articles in necessary format for us
  const feed = {
    title: dom.querySelector('title').textContent,
    description: dom.querySelector('description').textContent,
    articles,
  };
  return feed;
};
