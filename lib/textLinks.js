import React from 'react';

// Render plain text while turning only http(s) URLs into safe external links.
const URL_PATTERN = /(https?:\/\/[^\s<>"']+)/g;

export function renderTextWithLinks(text) {
  if (!text) return null;

  // Split line breaks first so React does not collapse them into a single space.
  return String(text).split(/(\r?\n)/).map((line, lineIndex) => {
    if (/\r?\n/.test(line)) return <br key={`break-${lineIndex}`} />;

    return line.split(URL_PATTERN).map((part, partIndex) => {
      if (!/^https?:\/\//i.test(part)) return part;
      try {
        const url = new URL(part);
        return (
          <a key={`${url.href}-${lineIndex}-${partIndex}`} href={url.href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline break-all hover:text-cyan-300">
            {part}
          </a>
        );
      } catch {
        return part;
      }
    });
  });
}
