// pages/api/scrape-metadata.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMeta = (property: string) =>
      $(`meta[property="${property}"]`).attr('content') || '';

    const metadata = {
      title: getMeta('og:title') || $('title').text(),
      description: getMeta('og:description') || '',
      image: getMeta('og:image') || '',
      url: getMeta('og:url') || url,
    };

    res.status(200).json(metadata);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
