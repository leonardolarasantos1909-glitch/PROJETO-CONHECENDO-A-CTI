import { Bookmark, BookmarkCheck, ArrowRight, BookOpen, ClipboardCheck, Languages } from 'lucide-react';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { favoriteCatalog, findFavorites, normalizeFavoriteIds, readableFavoriteIds } from './favorites';
import { readSavedIds, writeSavedIds, readLastPage } from './learning-storage';
import './learning-tools.css';

const KEY = 'cti-favorites-v1';
const allowed = favoriteCatalog.map(entry => entry.id);
const FavoritesContext = createContext({ ids: [] as string[], saved: true, toggle: (_id: string) => {}, clear: () => {} });

export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(() => normalizeFavoriteIds(readSavedIds(KEY, readableFavoriteIds)));
  const [saved, setSaved] = useState(true);
  function toggle(id: string) {
    if (!allowed.includes(id)) return;
    const next = ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
    setSaved(writeSavedIds(KEY, next));
    setIds(next);
  }
  return <FavoritesContext.Provider value={{ ids, saved, toggle, clear: () => { setIds([]); setSaved(true); } }}>{children}</FavoritesContext.Provider>;
}

export function FavoriteButton({ id }: { id: string }) {
  const { ids, saved, toggle } = useContext(FavoritesContext);
  const entry = favoriteCatalog.find(item => item.id === id);
  if (!entry) return null;
  const selected = ids.includes(id);
  const Icon = selected ? BookmarkCheck : Bookmark;
  return <div className="favorite-control"><button type="button" className={`favorite-button${selected ? ' is-saved' : ''}`} aria-pressed={selected} aria-label={`${selected ? 'Remover dos' : 'Adicionar aos'} favoritos: ${entry.title}`} onClick={() => toggle(id)}><Icon size={17} aria-hidden="true"/>{selected ? 'Salvo' : 'Favoritar'}</button>{!saved && <span role="status" className="learning-storage-note">Salvo apenas nesta sessão; o navegador não permitiu guardar no aparelho.</span>}</div>;
}

export function FavoritesPage() {
  const { ids, saved } = useContext(FavoritesContext);
  const entries = findFavorites(ids);
  return <section className="favorites-page" aria-label="Conteúdos favoritos">
    <p className="learning-local-note">Seus favoritos ficam somente neste navegador, sem cadastro. Limpar os dados do navegador remove essa lista.</p>
    {!saved && <p role="status" className="learning-storage-note">O navegador não permitiu salvar as alterações. A lista funciona enquanto você mantém esta sessão aberta.</p>}
    <p role="status" className="favorites-count">{entries.length} {entries.length === 1 ? 'conteúdo salvo' : 'conteúdos salvos'}</p>
    {entries.length ? <ul className="favorites-list">{entries.map(entry => <li key={entry.id}><div><span>{entry.kind}</span><a href={entry.href}>{entry.title}<ArrowRight size={17} aria-hidden="true"/></a></div><FavoriteButton id={entry.id}/></li>)}</ul>
      : <div className="favorites-empty"><Bookmark size={30} aria-hidden="true"/><h2>Guarde o que você quer rever.</h2><p>Use “Favoritar” nos módulos, assuntos, escalas e termos do siglário.</p><a className="button" href="#modulos">Explorar os módulos <ArrowRight size={17}/></a></div>}
  </section>;
}

export function LearningShortcuts() {
  const { ids } = useContext(FavoritesContext);
  const lastPage = readLastPage(96);
  return <section className="learning-shortcuts" aria-labelledby="learning-tools-title"><div className="section-heading"><div><span className="eyebrow">PARA O SEU ESTÁGIO</span><h2 id="learning-tools-title">Organize seu aprendizado</h2></div></div><div className="learning-shortcut-grid">
    <a href="#primeiro-dia"><ClipboardCheck size={24} aria-hidden="true"/><strong>Meu primeiro dia</strong><span>Um roteiro para conhecer o setor com seu preceptor.</span><span className="learning-shortcut-action">Abrir checklist <ArrowRight size={17}/></span></a>
    <a href="#glossario"><Languages size={24} aria-hidden="true"/><strong>Siglário</strong><span>Consulte as 746 siglas e definições da lista enviada para o projeto.</span><span className="learning-shortcut-action">Consultar termos <ArrowRight size={17}/></span></a>
    <a href="#favoritos"><Bookmark size={24} aria-hidden="true"/><strong>Meus favoritos</strong><span>{ids.length ? `${ids.length} ${ids.length === 1 ? 'conteúdo salvo' : 'conteúdos salvos'} neste navegador.` : 'Guarde os assuntos que deseja consultar novamente.'}</span><span className="learning-shortcut-action">Ver favoritos <ArrowRight size={17}/></span></a>
  </div>{lastPage > 1 && <a className="continue-reading" href="#caderno"><BookOpen size={22} aria-hidden="true"/><span><strong>Continuar a leitura do caderno</strong><span>Retomar na página {lastPage} de 96</span></span><ArrowRight size={18} aria-hidden="true"/></a>}</section>;
}
