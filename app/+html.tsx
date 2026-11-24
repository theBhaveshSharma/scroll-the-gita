import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Web-only root HTML for static rendering (Node.js only — no DOM/browser APIs).
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Scroll the Bhagavad Gita</title>
        <meta
          name="description"
          content="Read the Bhagavad Gita verse by verse — English and Hindi, study tools, and Quiet Space."
        />

        {/* Keep ScrollViews behaving like native; remove to allow body scroll on mobile web. */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #F3E6D0;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0E1218;
  }
}`;
