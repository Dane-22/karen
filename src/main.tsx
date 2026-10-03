import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { site, navigation } from './data/site';
import { contact, socials, projectInquiry } from './data/contact';
import { services } from './data/services';
import { categories, projects, type Category, type Media, type Project } from './data/projects';
import { collaborators, showCollaborators } from './data/collaborators';
import './fonts.css';
import './styles.css';
import { photographs } from './data/photography';
import { films } from './data/films';
import { FilmViewer } from './FilmViewer';
import { socialAccounts } from './data/socialAccounts';

function SectionBackdrop({ section, eager = false }: { section: keyof typeof site.sectionBackgrounds; eager?: boolean }) {
  const background = site.sectionBackgrounds[section];
  return <div className={`section-backdrop backdrop-${section}`} aria-hidden="true" style={{ '--background-position': background.position, '--mobile-background-position': background.mobilePosition } as React.CSSProperties}>
    <picture><source media="(max-width: 600px)" srcSet={background.mobile} /><img src={background.src} alt="" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" /></picture>
  </div>;
}

function PhotoViewer({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const photo = photographs[index];
  const step = (direction: number) => setIndex(current => (current + direction + photographs.length) % photographs.length);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="photo-viewer" aria-label="Photograph viewer" onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
    if (event.key === 'Tab') {
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <div className="viewer-toolbar"><span>Photography</span><span aria-live="polite">{index + 1} / {photographs.length}</span><button onClick={onClose} aria-label="Close photograph viewer" autoFocus>Close ×</button></div>
    <div className="viewer-stage"><button className="viewer-previous" onClick={() => step(-1)} aria-label="Previous photograph">←</button><MediaImage key={photo.id} src={photo.src} alt={photo.alt} eager /><button className="viewer-next" onClick={() => step(1)} aria-label="Next photograph">→</button></div>
  </dialog>;
}

function MediaImage({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed
    ? <div className="image-fallback" role="img" aria-label={alt || 'Decorative image unavailable'}>MOSAIKO<span>Image preview unavailable</span></div>
    : <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

function VideoAsset({ media, showreel = false }: { media: Media; showreel?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [media.src]);
  if (media.src && !failed) return <video controls playsInline preload="none" poster={media.poster} aria-label={media.alt} onError={() => setFailed(true)}>
    <source src={media.src} />
    {media.captions && <track kind="captions" src={media.captions} srcLang="en" label="English" default />}
    Your browser does not support video. <a href={media.src}>Download video</a>.
  </video>;
  return <div className={`video-poster ${showreel ? 'showreel-poster' : ''}`}>
    {media.poster && <MediaImage src={media.poster} alt={media.alt} />}
    <div className="video-poster-copy">
      <span className="eyebrow">MOSAIKO / Motion picture journal</span>
      {showreel && <span className="reel-title">Every frame,<br /><em>a feeling.</em></span>}
      <span className="video-status">{failed ? 'Video temporarily unavailable' : showreel ? 'Showreel coming soon' : 'Video sample coming soon'}</span>
    </div>
    {!media.src && <span className="poster-credit">Illustrated design preview / No footage yet</span>}
  </div>;
}

function PortfolioDialog({ category, onClose }: { category: Category; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const projectTrigger = useRef<HTMLButtonElement | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const photoTrigger = useRef<HTMLButtonElement | null>(null);
  const isPhotography = category.id === 'photography';
  const isFilm = category.id === 'film';
  const isSocialMedia = category.id === 'social-media';
  const [filmIndex, setFilmIndex] = useState<number | null>(null);
  const filmTrigger = useRef<HTMLButtonElement | null>(null);
  const items = projects.filter(p => p.category === category.id);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);

  useEffect(() => {
    dialog.current?.scrollTo(0, 0);
    if (project) heading.current?.focus();
    else if (projectTrigger.current) {
      const button = dialog.current?.querySelector<HTMLButtonElement>(`[data-project="${projectTrigger.current.dataset.project}"]`);
      button?.focus();
    } else heading.current?.focus();
  }, [project]);

  return <dialog ref={dialog} className={`portfolio-dialog${isPhotography ? ' photography-dialog' : ''}${isFilm ? ' film-dialog' : ''}`} aria-labelledby="portfolio-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], [tabindex="0"]'));
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    <div className="dialog-top">
      <button className="back-button" onClick={project ? () => setProject(null) : onClose}>← {project ? category.title : 'All collections'}</button>
      <span className="dialog-brand">MOSAIKO / {project ? 'Project journal' : 'The collection'}</span>
      <button className="close-button" onClick={onClose} aria-label="Close portfolio">Close ×</button>
    </div>
    <div className="dialog-content">
      <div className="detail-heading">
        <p className="eyebrow">{project ? `${category.title} / ${project.isConcept ? 'Concept preview' : 'Selected work'}` : 'A collection of perspectives'}</p>
        <h2 id="portfolio-title" ref={heading} tabIndex={-1}>{project?.title || category.title}<span className="rust">.</span></h2>
        <p>{project?.description || category.description}</p>
        {project && <p className="project-role"><strong>Karen’s role</strong>{project.role}</p>}
      </div>
      {isPhotography ? <div className="photography-grid">
        {photographs.map((photo, index) => <button key={photo.id} className="photography-photo" onClick={event => { photoTrigger.current = event.currentTarget; setPhotoIndex(index); }} aria-label={`Open photograph ${index + 1}: ${photo.alt}`}><MediaImage src={photo.thumbnail} alt={photo.alt} eager={index < 4} /></button>)}
      </div> : isFilm ? <div className="film-grid">
        {films.map((film, index) => <button key={film.id} className="film-card" onClick={event => { filmTrigger.current = event.currentTarget; setFilmIndex(index); }} aria-label={`Play ${film.title}`}>
          <span className="film-card-top">{film.format}<span>0{index + 1}</span></span>
          <span className="film-play" aria-hidden="true">▶</span>
          <span className="film-card-bottom"><span>{film.title}</span><span>Play film ↗</span></span>
        </button>)}
      </div> : isSocialMedia ? <div className="social-account-grid">
        {socialAccounts.map((account, index) => <a key={account.url} className="social-account-card" href={account.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${account.handle} on ${account.platform} (opens in a new tab)`}>
          <div className="social-account-preview"><MediaImage src={account.thumbnail} alt={`Screenshot of the ${account.handle} ${account.platform} page`} eager /></div>
          <span className="social-account-top"><span>{account.platform}</span><span>0{index + 1}</span></span>
          <span className="social-account-name">{account.platform === 'Instagram' ? '@' : ''}{account.handle}</span>
          <span className="social-account-bottom">View {account.platform === 'Instagram' ? 'profile' : 'page'}<span aria-hidden="true">↗</span></span>
        </a>)}
        <p className="social-account-note">Explore the accounts handled by Karen. Links open in a new tab.</p>
      </div> : project ? <>
        <div className="detail-gallery">
          {project.media.map((media, i) => <figure key={`${media.src}-${i}`}>
            {media.type === 'video' ? <VideoAsset media={media} /> : <MediaImage src={media.src} alt={media.alt} eager={i === 0} />}
            <figcaption><span>{media.caption}</span>{project.isConcept && <span>Concept preview</span>}</figcaption>
          </figure>)}
        </div>
        <div className="credits"><p className="eyebrow">Credits & sources</p>{[...new Set(project.media.map(m => `${m.credit} ${m.source}`))].map(credit => <p key={credit}>{credit}</p>)}</div>
      </> : <div className="project-grid">
        {items.length ? items.map(item => <button key={item.id} data-project={item.id} className="project-card" onClick={event => { projectTrigger.current = event.currentTarget; setProject(item); }} aria-label={`View ${item.title}${item.isConcept ? ' — Concept preview' : ''}`}>
          <div className="project-image"><MediaImage src={item.cover} alt={item.coverAlt} />{item.isConcept && <span className="concept-badge">Concept preview</span>}<span className="project-arrow" aria-hidden="true">↗</span></div>
          <div className="project-meta"><h3>{item.title}</h3><span>{item.subtitle}</span></div>
          {item.media.some(m => m.type === 'video' && !m.src) && <p className="project-video-note">Video sample coming soon</p>}
          {item.category === 'collaborations' && <p className="card-role">Karen’s role: {item.role}</p>}
        </button>) : <p className="empty-state">This collection is being prepared. New work will be added here.</p>}
      </div>}
    </div>
    {photoIndex !== null && <PhotoViewer initialIndex={photoIndex} onClose={() => { setPhotoIndex(null); requestAnimationFrame(() => photoTrigger.current?.focus({ preventScroll: true })); }} />}
    {filmIndex !== null && <FilmViewer film={films[filmIndex]} onClose={() => { setFilmIndex(null); requestAnimationFrame(() => filmTrigger.current?.focus({ preventScroll: true })); }} />}
  </dialog>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const visibleCategories = categories.filter(c => c.enabled);
  const hasConcepts = projects.some(p => p.isConcept && visibleCategories.some(c => c.id === p.category));
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape' && menuOpen) { setMenuOpen(false); menuToggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="opening" id="home">
      <header className="header">
        <a className="wordmark" href="#home" aria-label="Mosaiko home">mosaiko<span aria-hidden="true">✳</span></a>
        <span className="header-note">Independent creative journal</span>
        <button ref={menuToggle} className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button>
        <nav id="main-navigation" className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}{item.label === 'Contact' && ' ↗'}</a>)}</nav>
      </header>
      <main id="main">
        <section id="works" className="works-opening" aria-labelledby="opening-title">
          <SectionBackdrop section="opening" eager />
          <div className="identity"><div><p className="eyebrow">{site.openingNote}</p><h1 id="opening-title">{site.name}<span aria-hidden="true">✳</span></h1></div><p className="tagline">{site.tagline}</p></div>
          <div className="collection-bar"><h2>Choose a perspective</h2><span>01 — {String(visibleCategories.length).padStart(2, '0')} / The collections</span></div>
          <div className="category-grid" style={{ '--category-count': Math.max(1, visibleCategories.length) } as React.CSSProperties}>{visibleCategories.map((item, i) => <button key={item.id} className={`category-card category-${item.id}`} onClick={() => setCategory(item)} aria-label={`Explore ${item.title}`}>
            <MediaImage src={item.cover} alt={item.coverAlt} eager />
            <span className="category-frame" aria-hidden="true" />
            <span className="category-top"><span>VOL. 0{i + 1}</span>{item.isConcept && <span>Concept preview</span>}</span>
            <span className="category-copy"><span className="category-title">{item.title}</span><span className="category-description">{item.description}</span></span>
            <span className="category-arrow" aria-hidden="true">↗</span>
          </button>)}</div>
          <div className="collection-footer"><p>{hasConcepts ? 'Photography by Karen. Other collections include labeled design previews.' : 'A collection of work by Karen Joyce P. Dicang.'}</p><span aria-hidden="true">Still / Motion / Connection</span></div>
        </section>
        <section id="about" className="about section-pad">
          <div className="about-image"><MediaImage src={site.portrait?.src || '/media/window.svg'} alt={site.portrait?.alt || 'Warm architectural illustration standing in for a future portrait'} />{!site.portrait && <span className="image-note">Portrait to come / Design preview</span>}<span className="image-index" aria-hidden="true">FRAME / 01</span></div>
          <div className="about-copy"><p className="eyebrow">Behind the frames</p><h2>Many pieces.<br />One <em>Karen.</em></h2><p className="about-name">{site.person}</p><p>{site.intro}</p><p className="background">{site.background}</p><div className="draft-note">{!site.storyApproved && <span className="eyebrow">Personal story / Awaiting Karen’s copy</span>}<p>{site.originPlaceholder}</p></div></div>
        </section>
        <section className="services section-pad"><div><p className="eyebrow">What we can create</p><h2>A feeling.<br />A frame.<br /><em>A story.</em></h2></div><div className="service-list">{services.map((service, i) => <div className="service" key={service.title}><span className="service-number">0{i + 1}</span><div><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-star" aria-hidden="true">✳</span></div>)}</div></section>
        <section className="approach section-pad"><SectionBackdrop section="approach" /><div className="approach-copy"><p className="eyebrow">The creative approach</p><h2>{site.approachDraft}</h2>{!site.approachApproved && <p className="draft-label">Draft copy — awaiting Karen’s approval</p>}</div></section>
        <section className="reel section-pad"><div className="section-heading"><div><p className="eyebrow">In motion</p><h2>Stories that <em>move.</em></h2></div><span className="eyebrow">MOSAIKO / The reel</span></div><VideoAsset showreel media={{ type: 'video', src: site.reel.src, poster: site.reel.poster, captions: site.reel.captions, alt: 'MOSAIKO showreel', caption: '', credit: '', source: '' }} /></section>
        {showCollaborators && collaborators.length > 0 && <section className="collaborators section-pad"><p className="eyebrow">Clients / Collaborations</p><div>{collaborators.map(c => <div key={c.name}>{c.logo && <MediaImage src={c.logo} alt="" />}{c.url ? <a href={c.url}>{c.name}</a> : <span>{c.name}</span>}</div>)}</div></section>}
        <section id="contact" className="contact section-pad"><SectionBackdrop section="contact" /><p className="eyebrow">The next chapter</p><div className="contact-heading"><h2>Have a story<br /><em>in mind?</em></h2><span aria-hidden="true">✳</span></div><div className="contact-bottom"><div><p>I’d love to hear it.</p><a className="email" href={`mailto:${contact.email}`}>{contact.email}</a></div><a className="project-cta" href={projectInquiry}>Start a project <span aria-hidden="true">↗</span></a></div><p className="mailto-note">Opens your email app. Tell me a little about what you’re imagining.</p>{socials.length > 0 && <nav aria-label="Social links" className="socials">{socials.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</nav>}</section>
      </main>
      <footer><a className="wordmark" href="#home">mosaiko<span aria-hidden="true">✳</span></a><span>© {new Date().getFullYear()} {site.person}</span><a href="#home">Back to top ↑</a></footer>
    </div>
    {category && <PortfolioDialog key={category.id} category={category} onClose={() => setCategory(null)} />}
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
