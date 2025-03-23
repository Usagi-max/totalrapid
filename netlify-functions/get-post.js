// netlify-functions/get-post.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const html = require('remark-html');

const postsDirectory = path.join(process.cwd(), 'posts');

exports.handler = async function(event, context) {
  const { id } = event.queryStringParameters;
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const blogContent = await remark().use(html).process(matterResult.content);
  const blogContentHTML = blogContent.toString();

  return {
    statusCode: 200,
    body: JSON.stringify({
      id,
      blogContentHTML,
      ...matterResult.data,
    }),
  };
};
