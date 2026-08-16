export const TOKYO_TIME_ZONE = 'Asia/Tokyo';

const datePartsInTokyo = (value) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  return Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value: partValue }) => [type, partValue]));
};

export const getTokyoDateString = (value = new Date()) => {
  const { year, month, day } = datePartsInTokyo(value);
  return `${year}-${month}-${day}`;
};

// Registration dates are calendar dates. Convert one to the corresponding
// Japan Standard Time midnight, rather than relying on the viewer's timezone.
export const getTokyoMidnight = (dateString, daysAfter = 0) => {
  const match = String(dateString || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const fallback = datePartsInTokyo(new Date(dateString || Date.now()));
  const [year, month, day] = match
    ? match.slice(1).map(Number)
    : [Number(fallback.year), Number(fallback.month), Number(fallback.day)];
  const days = Number.isFinite(Number(daysAfter)) ? Number(daysAfter) : 0;
  return new Date(Date.UTC(year, month - 1, day + days) - 9 * 60 * 60 * 1000);
};

export const formatTokyoDate = (value) => {
  const { year, month, day } = datePartsInTokyo(value);
  return `${year}年${Number(month)}月${Number(day)}日`;
};
