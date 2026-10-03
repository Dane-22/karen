import { useEffect, useRef } from 'react';
import { facebookEmbedUrl, type Film } from './data/films';

export function FilmViewer({ film, onClose }: { film: Film; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return <dialog ref={dialog} className="film-viewer" aria-labelledby="film-viewer-title"
    onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => event.stopPropagation()}>
    <div className="viewer-toolbar"><h3 id="film-viewer-title">{film.title}</h3><button onClick={onClose} aria-label="Close film viewer" autoFocus>Close ×</button></div>
    <div className={`film-player${film.portrait ? ' film-player-portrait' : ''}`}>
      <iframe src={facebookEmbedUrl(film)} title={`${film.title} — ${film.format}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    </div>
    <div className="film-viewer-footer"><p>Use the player’s play button if playback doesn’t start.</p><a href={film.url} target="_blank" rel="noopener noreferrer">Watch on Facebook ↗</a></div>
  </dialog>;
}
