export const films = [
  { id: '1259508485334210', title: 'Film 01', format: 'Facebook Reel', url: 'https://www.facebook.com/reel/1259508485334210', portrait: true },
  { id: '583619661106697', title: 'Film 02', format: 'Facebook Reel', url: 'https://www.facebook.com/reel/583619661106697', portrait: true },
  { id: '1299406394108727', title: 'Film 03', format: 'Facebook Video', url: 'https://www.facebook.com/watch/?v=1299406394108727', portrait: false },
  { id: '3600869410203894', title: 'Film 04', format: 'Facebook Video', url: 'https://www.facebook.com/watch/?v=3600869410203894', portrait: false },
];

export type Film = typeof films[number];

export function facebookEmbedUrl(film: Film) {
  const parameters = new URLSearchParams({ href: film.url, show_text: 'false', autoplay: 'true', width: film.portrait ? '360' : '960' });
  return `https://www.facebook.com/plugins/video.php?${parameters}`;
}
