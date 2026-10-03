export type CategoryId = 'photography' | 'film' | 'social-media' | 'collaborations';
export type Media = {
  type: 'image' | 'video'; src: string; poster?: string; captions?: string;
  alt: string; caption: string; credit: string; source: string;
};
export type Project = {
  id: string; title: string; category: CategoryId; subtitle: string;
  description: string; role: string; isConcept: boolean;
  cover: string; coverAlt: string; media: Media[];
};
export type Category = {
  id: CategoryId; title: string; description: string;
  cover: string; coverAlt: string; enabled: boolean; isConcept: boolean;
};
export const categories: Category[] = [
  { id: 'photography', title: 'Photography', description: 'Still moments. A closer look.', cover: '/media/photography/IMG_0670%20(1)-large.jpg', coverAlt: 'Monochrome studio portrait of a woman seated on a stool', enabled: true, isConcept: false },
  { id: 'film', title: 'Film', description: 'Stories told in motion.', cover: '/media/hills.svg', coverAlt: 'Olive landscape illustration for the Film collection', enabled: true, isConcept: false },
  { id: 'social-media', title: 'Social Media', description: 'A selection of Instagram profiles and Facebook pages handled by Karen.', cover: '/media/social-media-cover.jpg', coverAlt: 'Mosaiko logo with colored mosaic tiles on a light background', enabled: true, isConcept: false },
  { id: 'collaborations', title: 'Collaborations', description: 'Different minds. Shared vision.', cover: '/media/collab.svg', coverAlt: 'Original split-frame concept artwork combining architecture and a landscape', enabled: true, isConcept: true },
];
const credit = 'Original local vector artwork created for the MOSAIKO website demo. Not Karen’s photography or completed work.';
const source = 'Website demo illustration; no external stock assets.';
const art = (name: string, alt: string, caption: string): Media => ({ type: 'image', src: `/media/${name}.svg`, alt, caption, credit, source });
const film = (name: string, alt: string): Media => ({ type: 'video', src: '', poster: `/media/${name}.svg`, alt, caption: 'Visual treatment / no footage available', credit, source });
const previewRole = 'Not assigned — design preview only; Karen has not produced this project.';
export const projects: Project[] = [
  {
    id: 'somewhere-slow', title: 'Somewhere, slow', category: 'photography', subtitle: 'Landscape / Image series', isConcept: true,
    description: 'A photo-series layout exploring wide horizons and quiet compositions. Original illustrations stand in for future photographs.', role: previewRole,
    cover: '/media/coast.svg', coverAlt: 'Illustrated terracotta coastline beneath a pale blue sky',
    media: [art('coast', 'Illustrated terracotta coastline beneath a pale blue sky', '01 / The long way home'), art('hills', 'Layered olive hills in warm evening light', '02 / A quieter perspective'), art('dunes', 'Soft sculptural dunes beneath a warm sun', '03 / The shape of stillness')],
  },
  {
    id: 'ordinary-poetry', title: 'Ordinary poetry', category: 'photography', subtitle: 'Still life / Editorial study', isConcept: true,
    description: 'A still-life presentation exploring objects and afternoon shadows. These are graphic placeholders, not a commissioned shoot.', role: previewRole,
    cover: '/media/still-life.svg', coverAlt: 'Illustrated ceramic vase and branch beside a sunlit arch',
    media: [art('still-life', 'Illustrated ceramic vase and branch beside a sunlit arch', '01 / Afternoon at home'), art('window', 'Architectural illustration of an arched window and shadows', '02 / Light as a subject')],
  },
  {
    id: 'a-place-to-pause', title: 'A place to pause', category: 'photography', subtitle: 'Architecture / Light study', isConcept: true,
    description: 'A visual study of spaces and light, demonstrating a future architectural photo series with illustrated placeholders.', role: previewRole,
    cover: '/media/window.svg', coverAlt: 'Warm architectural illustration of an arched window',
    media: [art('window', 'Warm arched window looking out onto green hills', '01 / A window of time'), art('still-life', 'Ceramic vase in a warm architectural space', '02 / A lived-in detail')],
  },
  {
    id: 'in-between', title: 'The in-between', category: 'film', subtitle: 'Short film / Visual treatment', isConcept: true,
    description: 'A film treatment about pauses and transitions. Designed frames demonstrate a film project page; no footage has been produced.', role: previewRole,
    cover: '/media/hills.svg', coverAlt: 'Abstract green mountain landscape with a setting sun',
    media: [film('hills', 'Illustrated green hills, a placeholder film poster'), art('coast', 'Illustrated quiet coastline in evening light', '02 / Transition study')],
  },
  {
    id: 'where-light-lingers', title: 'Where light lingers', category: 'film', subtitle: 'Motion study / Visual treatment', isConcept: true,
    description: 'A mood-led film layout built around warm tones and shifting light. Illustrated storyboards preview the future media experience.', role: previewRole,
    cover: '/media/dunes.svg', coverAlt: 'Minimal desert illustration with flowing rust-colored dunes',
    media: [film('dunes', 'Illustrated desert landscape, a placeholder film poster'), art('window', 'Warm architectural arch with diagonal shadows', '02 / A study of light')],
  },
  {
    id: 'small-observations', title: 'Small observations', category: 'social-media', subtitle: 'Social posts / Editorial series', isConcept: true,
    description: 'A sample carousel system bringing short editorial copy and illustrated objects together. No brand, account, or campaign results are represented.', role: previewRole,
    cover: '/media/social-journal.svg', coverAlt: 'Graphic visual-journal post with a still-life illustration',
    media: [art('social-journal', 'Editorial social post reading A visual journal', '01 / Opening post'), art('social-notes', 'Sample social carousel panel reading Notice the little things', '02 / Carousel continuation')],
  },
  {
    id: 'a-slower-feed', title: 'A slower feed', category: 'social-media', subtitle: 'Content planning / Feed concept', isConcept: true,
    description: 'A sample social content system mixing image studies, editorial notes, and a simple posting sequence. This is a management-layout demo, not a managed account.', role: previewRole,
    cover: '/media/social-grid.svg', coverAlt: 'Nine-tile sample social feed in olive, cream, and terracotta',
    media: [art('social-grid', 'Nine-tile social feed concept with illustrated objects and text', '01 / Feed overview'), art('social-notes', 'Editorial sample post on a cream background', '02 / Copy-led post')],
  },
  {
    id: 'the-weekend-edit', title: 'The weekend edit', category: 'social-media', subtitle: 'Content series / Campaign concept', isConcept: true,
    description: 'A sample content-series treatment with a headline post and an illustrated motion poster. No client, live campaign, or performance claims.', role: previewRole,
    cover: '/media/social-notes.svg', coverAlt: 'Typography-led sample post with a small landscape illustration',
    media: [art('social-notes', 'Sample editorial post reading Notice the little things', '01 / Series introduction'), film('coast', 'Coastal illustration standing in for a social video')],
  },
  {
    id: 'shared-perspectives', title: 'Shared perspectives', category: 'collaborations', subtitle: 'Collaborative editorial / Layout study', isConcept: true,
    description: 'A layout for a future collaboration, bringing image-making and creative coordination into one project. No client, collaborator, or production is attached.', role: previewRole,
    cover: '/media/collab.svg', coverAlt: 'Split-frame editorial illustration pairing architecture with landscape',
    media: [art('collab', 'Split-frame architectural and landscape concept artwork', '01 / A shared direction'), art('still-life', 'Original still-life illustration for a collaborative layout preview', '02 / Detail study')],
  },
];
