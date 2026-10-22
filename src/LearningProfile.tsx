import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, GraduationCap, Users } from 'lucide-react';
import { isLearningProfileId, PROFILE_KEY, profileLabels, profileRecommendations, readLearningProfile, saveLearningProfile, type LearningProfileId } from './learning-profile';
import './learning-profile.css';

type LearningProfileState = {
  profile: LearningProfileId | null;
  chooseProfile: (profile: LearningProfileId | null) => void;
  saved: boolean;
  resetProfile: () => void;
};

const LearningProfileContext = createContext<LearningProfileState | undefined>(undefined);

export function LearningProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<LearningProfileId | null>(readLearningProfile);
  const [saved, setSaved] = useState(true);
  const chooseProfile = useCallback((next: LearningProfileId | null) => {
    if (next !== null && !isLearningProfileId(next)) return;
    setProfile(next);
    setSaved(saveLearningProfile(next));
  }, []);
  const resetProfile = useCallback(() => chooseProfile(null), [chooseProfile]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === PROFILE_KEY || event.key === null) setProfile(readLearningProfile());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return <LearningProfileContext.Provider value={{ profile, chooseProfile, saved, resetProfile }}>{children}</LearningProfileContext.Provider>;
}

export function useLearningProfile(): LearningProfileState {
  const context = useContext(LearningProfileContext);
  if (!context) throw new Error('O perfil precisa de LearningProfileProvider.');
  return context;
}

export function ProfileChooser({ compact = false }: { compact?: boolean }) {
  const { profile, chooseProfile, saved } = useLearningProfile();
  const prefix = useId();
  const storageMessage = saved
    ? 'A escolha fica apenas neste navegador. Não exige cadastro e pode ser alterada a qualquer momento.'
    : 'O navegador não permitiu guardar a escolha. O perfil funciona nesta sessão; você pode escolher novamente ao retornar.';

  if (compact) return <div className="profile-compact">
    <label htmlFor={`${prefix}-compact`} className="profile-sr-only">Perfil de aprendizagem</label>
    <select id={`${prefix}-compact`} value={profile ?? ''} aria-label="Perfil de aprendizagem" onChange={event => chooseProfile(isLearningProfileId(event.target.value) ? event.target.value : null)}>
      <option value="">Explorar os dois perfis</option>
      <option value="estagiario">Sou estagiário</option>
      <option value="colaborador">Sou novo colaborador</option>
    </select>
    {!saved && <span className="profile-compact-warning" role="status">Somente nesta sessão: não foi possível salvar.</span>}
  </div>;

  return <section className="profile-chooser" aria-labelledby={`${prefix}-title`}>
    <h2 id={`${prefix}-title`}>Como você está chegando à CTI?</h2>
    <p>Escolha seu ponto de partida. Os conteúdos gerais continuam disponíveis para os dois públicos.</p>
    <div className="profile-options" role="group" aria-label="Escolher perfil de aprendizagem">
      <button type="button" className={`profile-option${profile === 'estagiario' ? ' is-selected' : ''}`} aria-pressed={profile === 'estagiario'} onClick={() => chooseProfile('estagiario')}>
        <GraduationCap size={25} aria-hidden="true"/><span><strong>Sou estagiário</strong><span>Primeiro dia, orientação com o preceptor e bases para o estágio.</span></span>
      </button>
      <button type="button" className={`profile-option${profile === 'colaborador' ? ' is-selected' : ''}`} aria-pressed={profile === 'colaborador'} onClick={() => chooseProfile('colaborador')}>
        <Users size={25} aria-hidden="true"/><span><strong>Sou novo colaborador</strong><span>Ambientação, comunicação e organização da integração ao setor.</span></span>
      </button>
    </div>
    <div className="profile-chooser-bottom"><button type="button" className="profile-explore" onClick={() => chooseProfile(null)} aria-pressed={profile === null}>Explorar sem escolher perfil</button><p role="status">{storageMessage}</p></div>
  </section>;
}

export function ProfileWelcome() {
  const { profile } = useLearningProfile();
  const prefix = useId();
  const previousProfile = useRef(profile);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (profile && profile !== previousProfile.current) heading.current?.focus();
    previousProfile.current = profile;
  }, [profile]);
  if (!profile) return <ProfileChooser/>;
  return <section className="profile-welcome" aria-labelledby={`${prefix}-welcome`}>
    <div className="profile-welcome-heading"><div><span className="profile-eyebrow">SEU PONTO DE PARTIDA</span><h2 ref={heading} tabIndex={-1} id={`${prefix}-welcome`}>{profileLabels[profile]}</h2><p>Estes atalhos priorizam sua chegada. Todos os módulos abaixo continuam disponíveis.</p></div><a className="profile-change-link" href="#perfil">Trocar perfil <ArrowRight size={17} aria-hidden="true"/></a></div>
    <ul className="profile-recommendations">{profileRecommendations[profile].map(item => <li key={item.href}><a href={item.href}><strong>{item.title}</strong><span>{item.description}</span><ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul>
  </section>;
}
