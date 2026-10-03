export const socialAccounts = [
  { handle: 'aducktivephilippines', platform: 'Instagram', url: 'https://www.instagram.com/aducktivephilippines/' },
  { handle: 'menalaherbals', platform: 'Instagram', url: 'https://www.instagram.com/menalaherbals/' },
  { handle: 'afbmangaan', platform: 'Facebook', url: 'https://www.facebook.com/afbmangaan' },
  { handle: 'foG2516', platform: 'Facebook', url: 'https://www.facebook.com/foG2516' },
  { handle: 'mosaiko_studio', platform: 'Instagram', url: 'https://www.instagram.com/mosaiko_studio/' },
  { handle: 'CCMManimalbitecenter', platform: 'Facebook', url: 'https://www.facebook.com/CCMManimalbitecenter/' },
].map(account => ({ ...account, thumbnail: `/media/social-accounts/${account.handle}.jpg` }));
