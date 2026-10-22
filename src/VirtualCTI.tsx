import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowRight, Eye, LayoutGrid, List, X } from 'lucide-react';
import EquipmentIllustration from './EquipmentIllustration';
import { topicHref } from './favorites';
import { virtualStations, type VirtualStation } from './virtual-cti';
import './virtual-cti.css';

function FictionalBoxDrawing() {
  return <svg className="virtual-box-drawing" viewBox="0 0 760 540" aria-hidden="true" focusable="false">
    <rect className="virtual-room-floor" x="17" y="17" width="726" height="506" rx="24"/>
    <path className="virtual-room-line" d="M32 60 H728 M47 475 H713"/>
    <rect className="virtual-room-bed-base" x="271" y="136" width="215" height="267" rx="22"/>
    <rect className="virtual-room-bed" x="287" y="119" width="183" height="267" rx="18"/>
    <rect className="virtual-room-pillow" x="305" y="141" width="146" height="56" rx="12"/>
    <path className="virtual-room-line" d="M303 219 H453 M303 240 H453 M303 261 H453 M274 168 V313 M484 168 V313"/>
    <path className="virtual-room-bed-foot" d="M299 399 V415 M459 399 V415 M287 416 H471"/>
    <rect className="virtual-room-equipment" x="66" y="66" width="112" height="77" rx="12"/>
    <rect className="virtual-room-screen" x="80" y="79" width="85" height="47" rx="5"/>
    <path className="virtual-room-line" d="M122 145 V170 M98 171 H145"/>
    <rect className="virtual-room-equipment" x="570" y="65" width="111" height="79" rx="12"/>
    <rect className="virtual-room-screen" x="584" y="78" width="83" height="46" rx="5"/>
    <path className="virtual-room-line" d="M601 149 V174 M652 149 V174 M591 175 H663"/>
    <path className="virtual-room-line" d="M88 199 H159 M123 195 V295 M99 296 H148"/>
    <rect className="virtual-room-equipment" x="100" y="210" width="45" height="57" rx="7"/>
    <rect className="virtual-room-screen" x="109" y="220" width="27" height="19" rx="4"/>
    <rect className="virtual-room-equipment" x="586" y="201" width="78" height="72" rx="15"/>
    <circle className="virtual-room-pillow" cx="626" cy="225" r="12"/>
    <path className="virtual-room-line" d="M609 248 H642"/>
    <rect className="virtual-room-equipment" x="81" y="333" width="79" height="70" rx="15"/>
    <path className="virtual-room-line" d="M99 350 H140 M99 364 H140 M99 378 H126"/>
    <rect className="virtual-room-equipment" x="587" y="332" width="78" height="71" rx="15"/>
    <path className="virtual-room-line" d="M606 351 H645 M606 365 H645 M606 379 H632"/>
    <rect className="virtual-room-equipment" x="243" y="438" width="77" height="63" rx="14"/>
    <rect className="virtual-room-equipment" x="440" y="438" width="77" height="63" rx="14"/>
  </svg>;
}

function StationDialog({ station, returnTo, close }: { station: VirtualStation; returnTo: HTMLElement | null; close: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    headingRef.current?.focus();
    return () => {
      if (dialog?.open) dialog.close();
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    };
  }, [returnTo]);

  return <dialog
    ref={dialogRef}
    className="virtual-cti-dialog"
    aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === dialogRef.current) close(); }}
  >
    <div className="virtual-dialog-content">
      <div className="virtual-dialog-heading">
        <div><span className="virtual-eyebrow">EXPLORAÇÃO EDUCATIVA</span><h2 ref={headingRef} id={titleId} tabIndex={-1}>{station.title}</h2></div>
        <button className="virtual-close" type="button" onClick={close} aria-label="Fechar explicação"><X size={22} aria-hidden="true"/></button>
      </div>
      <p className="virtual-dialog-intro">Conheça a finalidade e as partes no esquema já disponível no aplicativo. A cena não demonstra instalação, conexão ou ajuste do equipamento.</p>
      <EquipmentIllustration moduleId={station.moduleId} topicTitle={station.topicTitle}/>
      <div className="virtual-dialog-actions">
        <a href={topicHref(station.moduleId, station.topicTitle)} onClick={close}>Explorar assunto no módulo <ArrowRight size={17} aria-hidden="true"/></a>
        <button type="button" onClick={close}>Voltar ao box</button>
      </div>
    </div>
  </dialog>;
}

export default function VirtualCTI() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const prefix = useId();
  const selected = virtualStations.find(station => station.id === selectedId);

  function explore(station: VirtualStation, event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setSelectedId(station.id);
  }

  return <section className="virtual-cti" aria-labelledby={`${prefix}-heading`}>
    <div className="virtual-intro">
      <span className="virtual-intro-icon"><LayoutGrid size={25} aria-hidden="true"/></span>
      <div><h2 id={`${prefix}-heading`}>Explore um box fictício</h2><p>Selecione um número na cena ou um item da lista para reconhecer equipamentos e dispositivos com a equipe.</p></div>
    </div>
    <div className="virtual-context"><Eye size={21} aria-hidden="true"/><p><strong>Ilustração para estudo.</strong> Não representa a planta de um hospital, um paciente ou uma montagem de equipamentos. As posições apenas organizam os oito itens; eles não descrevem um conjunto de dispositivos usado em uma pessoa.</p></div>

    <figure className="virtual-box-figure">
      <div className="virtual-box-stage" role="group" aria-label="Box fictício com oito itens para explorar" aria-describedby={`${prefix}-scene-help`}>
        <FictionalBoxDrawing/>
        <span className="virtual-scene-label" aria-hidden="true">Box fictício · leito vazio</span>
        {virtualStations.map((station, index) => <button
          key={station.id}
          className="virtual-box-station"
          type="button"
          data-station-id={station.id}
          style={{ '--station-x': `${station.x}%`, '--station-y': `${station.y}%` } as CSSProperties}
          aria-label={`Explorar ${station.title} no box`}
          aria-haspopup="dialog"
          aria-pressed={selectedId === station.id}
          onClick={event => explore(station, event)}
        ><span aria-hidden="true">{index + 1}</span></button>)}
      </div>
      <figcaption id={`${prefix}-scene-help`}>Os números correspondem à lista abaixo. Use Tab para alcançar os botões e Enter ou Espaço para abrir uma explicação. A lista oferece as mesmas oito opções, sem depender da imagem.</figcaption>
    </figure>

    <div className="virtual-list-heading"><List size={21} aria-hidden="true"/><h3>Os mesmos itens em lista</h3></div>
    <ol className="virtual-station-list">
      {virtualStations.map((station, index) => <li key={station.id}>
        <button type="button" data-station-id={station.id} aria-label={`Abrir ${station.title} na lista`} aria-haspopup="dialog" aria-pressed={selectedId === station.id} onClick={event => explore(station, event)}>
          <span className="virtual-list-number" aria-hidden="true">{index + 1}</span><span>{station.title}</span><ArrowRight size={18} aria-hidden="true"/>
        </button>
        <p>{station.description}</p>
      </li>)}
    </ol>
    <p className="virtual-review">Conteúdo educativo baseado nos módulos e desenhos existentes. Revisão clínica e institucional pendente. O reconhecimento de um item não autoriza sua manipulação; a atuação depende das atribuições, capacitação e orientação da equipe.</p>
    {selected && <StationDialog key={selected.id} station={selected} returnTo={openerRef.current} close={() => setSelectedId(null)}/>}
  </section>;
}
