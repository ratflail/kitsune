console.log('💡 main.js is loaded');

import './styles/main.scss';
import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

// Initialize the Contentful client
const client = createClient({
  space: '3mk76s1x85nr',
  accessToken: '7kG-zJqwYDjbanh3JOLlz9aK1d7pW8cvfHaf6pcDE6M',
});

// Fetch entries and render them to the page
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cms');
  console.log('Container:', container); // See if this logs null or a div
  if (!container) return;

  client
    .getEntries({ content_type: 'blogPost', include: 2 })
    .then(response => {
      response.items.forEach(item => {
        const { title, post, media, dateTime } = item.fields;
        console.log('MEDIA:', media);
        console.log('🧾 Raw post field:', post);

        const html = documentToHtmlString(post);
        const imageElements = [];

        if (Array.isArray(media)) {
          media.forEach(asset => {
            // Make sure asset and its fields exist
            if (
              asset &&
              asset.fields &&
              asset.fields.file &&
              asset.fields.file.url
            ) {
              const fileUrl = asset.fields.file.url;

              // Try to get the image title, use 'Image' as a backup
              const title = asset.fields.title ? asset.fields.title : 'Image';

              // Build the image HTML string
              const imgTag = `<img src="${fileUrl}" class="image" alt="${title}" />`;

              // Add it to our array of image elements
              imageElements.push(imgTag);
            }
          });
        }

        // Join all image tags into one big HTML string
        const images = imageElements.join('');

        // Fancy way for img/media
        // const images = Array.isArray(media)
        //   ? media
        //       .map(asset => {
        //         const fileUrl = asset?.fields?.file?.url;
        //         const title = asset?.fields?.title || 'Image';
        //         return fileUrl ? `<img src="${fileUrl}" alt="${title}" />` : '';
        //       })
        //       .join('')
        //   : '';

        const blog = document.createElement('div');
        blog.innerHTML = `
        <h2>${title}</h2>
        <p class="time"><em>${new Date(dateTime).toLocaleDateString()}</em></p>
        ${html}
        ${images}
      `;
        blog.classList.add('blog-post');

        container.appendChild(blog);
      });
    })
    .catch(console.error);
});
