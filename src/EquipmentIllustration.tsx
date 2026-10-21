import { pdfReaderLink } from './pdf-catalog';
import { useId, type ReactNode } from 'react';
import { ArrowUpRight, Eye } from 'lucide-react';
import { equipmentDiagrams, type DiagramKind } from './equipment-diagrams';
import './equipment-illustrations.css';

function Marker({ number, x, y, line }: { number: number; x: number; y: number; line?: string }) {
  return <g className="equipment-marker" aria-hidden="true">
    {line && <path className="equipment-leader" d={line}/>}
    <circle cx={x} cy={y} r="20"/>
    <text x={x} y={y} dominantBaseline="central" textAnchor="middle">{number}</text>
  </g>;
}

function Screen({ x = 45, y = 45, width = 170, height = 105 }: { x?: number; y?: number; width?: number; height?: number }) {
  return <><rect className="equipment-body" x={x - 10} y={y - 10} width={width + 20} height={height + 30} rx="12"/><rect className="equipment-screen" x={x} y={y} width={width} height={height} rx="6"/><path className="equipment-trace" d={`M${x + 10} ${y + height / 2} h25 l9 -12 10 25 12 -43 13 58 11 -28 h${Math.max(10, width - 103)}`}/></>;
}

function Cannula({ x = 35, y = 40, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path className="equipment-line" d="M0 45 C30 10 37 5 55 30 M55 30 H90 M90 30 C108 5 116 10 145 45 M60 30 v-15 M85 30 v-15 M0 45 C7 90 34 111 71 121 C108 110 138 88 145 45 M71 121 v25"/><rect className="equipment-body" x="58" y="62" width="27" height="18" rx="5"/></g>;
}

function DiagramDrawing({ kind }: { kind: DiagramKind }): ReactNode {
  switch (kind) {
    case 'monitor': return <>
      <Screen x={42} y={38} width={180} height={96}/><path className="equipment-outline" d="M115 154 v22 h40 v-22 M95 182 h80"/>
      <path className="equipment-line" d="M235 60 h22 c15 0 14 22 27 22"/><circle className="equipment-body" cx="300" cy="88" r="12"/><circle className="equipment-body" cx="276" cy="116" r="11"/><path className="equipment-line" d="M255 95 l13 14 M235 110 c25 0 24 44 45 44"/><rect className="equipment-body" x="279" y="142" width="37" height="27" rx="10"/><path className="equipment-line" d="M120 190 C124 207 183 211 208 194"/><rect className="equipment-body" x="215" y="183" width="82" height="29" rx="8"/>
      <Marker number={1} x={37} y={24} line="M49 40 L68 56"/><Marker number={2} x={317} y={31} line="M309 49 L299 76"/><Marker number={3} x={329} y={151} line="M310 151 L297 154"/><Marker number={4} x={318} y={210} line="M300 204 L282 199"/>
    </>;
    case 'ventilator': return <>
      <Screen x={38} y={43} width={128} height={85}/><path className="equipment-outline" d="M100 149 v56 M70 210 h70"/><circle className="equipment-body" cx="72" cy="216" r="7"/><circle className="equipment-body" cx="138" cy="216" r="7"/>
      <path className="equipment-tube" d="M193 100 C215 94 230 99 230 123 V154 C230 177 292 179 292 146 V106"/><path className="equipment-line" d="M193 100 C215 94 230 99 230 123 V154 C230 177 292 179 292 146 V106"/><rect className="equipment-body" x="272" y="87" width="39" height="24" rx="7"/>
      <rect className="equipment-body" x="204" y="184" width="83" height="36" rx="8"/><path className="equipment-fill" d="M223 194 v-16 h44 v16"/>
      <Marker number={1} x={39} y={23} line="M50 40 L67 55"/><Marker number={2} x={325} y={126} line="M305 130 L292 137"/><Marker number={3} x={320} y={203} line="M301 203 L287 203"/>
    </>;
    case 'infusion': return <>
      <path className="equipment-outline" d="M142 10 h48 M166 10 v210 M133 220 h65"/><rect className="equipment-body" x="68" y="30" width="62" height="69" rx="12"/><path className="equipment-line" d="M86 31 v-9 h27 v9 M99 99 v23"/><rect className="equipment-fill" x="75" y="61" width="48" height="29" rx="5"/>
      <rect className="equipment-body" x="71" y="131" width="128" height="75" rx="10"/><rect className="equipment-screen" x="84" y="142" width="76" height="35" rx="4"/><circle className="equipment-accent" cx="177" cy="160" r="8"/><path className="equipment-line" d="M99 121 C221 117 242 136 240 157 V182 C240 199 286 205 298 184"/>
      <Marker number={1} x={38} y={55} line="M58 55 L70 55"/><Marker number={2} x={38} y={169} line="M58 169 L73 169"/><Marker number={3} x={294} y={139} line="M276 147 L241 157"/>
    </>;
    case 'syringe': return <>
      <rect className="equipment-body" x="37" y="92" width="266" height="105" rx="12"/><rect className="equipment-screen" x="63" y="133" width="99" height="42" rx="5"/><circle className="equipment-accent" cx="213" cy="155" r="9"/>
      <rect className="equipment-fill" x="71" y="56" width="130" height="38" rx="5"/><path className="equipment-outline" d="M91 56 v38 M110 58 v14 M129 58 v14 M148 58 v14 M167 58 v14 M200 75 h44 M244 53 v43 M70 75 H48"/><rect className="equipment-body" x="243" y="45" width="31" height="55" rx="5"/>
      <Marker number={1} x={117} y={24} line="M117 44 L117 57"/><Marker number={2} x={311} y={61} line="M291 65 L273 72"/><Marker number={3} x={197} y={214} line="M188 197 L165 168"/>
    </>;
    case 'suction': return <>
      <rect className="equipment-body" x="34" y="43" width="82" height="62" rx="10"/><circle className="equipment-outline" cx="76" cy="73" r="19"/><path className="equipment-outline" d="M76 73 l10 -8"/>
      <rect className="equipment-body" x="135" y="93" width="91" height="112" rx="14"/><path className="equipment-outline" d="M129 94 h103 M153 136 h23 M153 156 h23 M153 176 h23"/><path className="equipment-line" d="M232 75 C302 60 311 108 293 128 S277 180 322 190"/><rect className="equipment-fill" x="237" y="39" width="41" height="24" rx="8"/>
      <Marker number={1} x={38} y={20} line="M47 37 L58 48"/><Marker number={2} x={104} y={161} line="M124 161 L137 161"/><Marker number={3} x={329} y={110} line="M309 112 L300 118"/><Marker number={4} x={310} y={35} line="M292 44 L277 51"/>
    </>;
    case 'oxygen': return <>
      <rect className="equipment-body" x="34" y="39" width="71" height="73" rx="9"/><circle className="equipment-outline" cx="70" cy="75" r="20"/>
      <rect className="equipment-body" x="143" y="31" width="39" height="124" rx="12"/><path className="equipment-outline" d="M163 45 v91 M151 156 h24"/><circle className="equipment-accent" cx="163" cy="111" r="7"/>
      <Cannula x={209} y={71} scale={0.72}/>
      <Marker number={1} x={40} y={17} line="M49 35 L58 49"/><Marker number={2} x={154} y={195} line="M156 175 L162 151"/><Marker number={3} x={317} y={44} line="M307 61 L289 90"/>
    </>;
    case 'high-flow': return <>
      <Cannula x={165} y={12} scale={0.95}/><path className="equipment-tube" d="M258 177 C269 201 220 217 197 192"/><path className="equipment-line" d="M258 177 C269 201 220 217 197 192"/>
      <rect className="equipment-body" x="32" y="104" width="121" height="105" rx="12"/><rect className="equipment-screen" x="46" y="117" width="67" height="34" rx="4"/><rect className="equipment-fill" x="48" y="169" width="52" height="31" rx="8"/><path className="equipment-outline" d="M118 181 h19"/>
      <Marker number={1} x={323} y={30} line="M304 38 L276 47"/><Marker number={2} x={313} y={197} line="M294 191 L261 182"/><Marker number={3} x={46} y={73} line="M53 92 L65 106"/>
    </>;
    case 'renal': return <>
      <Screen x={39} y={37} width={117} height={78}/><rect className="equipment-body" x="29" y="137" width="139" height="57" rx="9"/><path className="equipment-outline" d="M62 194 v20 M135 194 v20 M48 218 h101"/>
      <rect className="equipment-body" x="232" y="54" width="55" height="117" rx="15"/><path className="equipment-outline" d="M240 71 h39 M240 151 h39 M248 78 v64 M259 78 v64 M270 78 v64"/>
      <path className="equipment-line equipment-line-accent" d="M192 51 C214 19 309 23 311 63 V155 C312 187 213 192 195 168"/><path className="equipment-line" d="M192 90 C206 77 218 89 231 99 M287 130 C321 129 325 186 301 204"/>
      <Marker number={1} x={35} y={18} line="M44 36 L58 49"/><Marker number={2} x={223} y={217} line="M232 198 L247 168"/><Marker number={3} x={330} y={76} line="M312 84 L304 93"/>
    </>;
    case 'venous': return <>
      <rect className="equipment-fill" x="41" y="113" width="256" height="94" rx="22"/><rect className="equipment-dressing" x="119" y="127" width="105" height="64" rx="12"/>
      <path className="equipment-line" d="M176 165 V93 C176 72 115 77 113 48 M176 110 C176 66 233 79 234 49"/><rect className="equipment-body" x="98" y="30" width="30" height="26" rx="5"/><rect className="equipment-body" x="219" y="30" width="30" height="26" rx="5"/><path className="equipment-outline" d="M156 153 h41 v18 h-41z"/>
      <Marker number={1} x={173} y={24} line="M153 27 L128 40"/><Marker number={2} x={274} y={117} line="M259 129 L196 160"/><Marker number={3} x={65} y={148} line="M85 151 L120 160"/>
    </>;
    case 'urinary': return <>
      <path className="equipment-line" d="M37 58 H104 C137 58 125 117 162 117 H221 V134"/><rect className="equipment-dressing" x="57" y="39" width="44" height="38" rx="8"/>
      <rect className="equipment-body" x="164" y="139" width="116" height="77" rx="14"/><path className="equipment-fill" d="M173 180 H271 V204 Q271 208 265 208 H179 Q173 208 173 202z"/><path className="equipment-outline" d="M186 154 h24 M186 169 h24 M222 215 v12"/>
      <Marker number={1} x={66} y={17} line="M70 37 L75 42"/><Marker number={2} x={177} y={72} line="M178 92 L179 117"/><Marker number={3} x={317} y={171} line="M297 174 L279 177"/>
    </>;
    case 'enteral': return <>
      <rect className="equipment-body" x="38" y="77" width="42" height="39" rx="8"/><path className="equipment-line" d="M80 96 C113 96 103 58 145 58 H250 C305 58 308 192 264 196 H170"/><rect className="equipment-dressing" x="220" y="33" width="34" height="54" rx="7"/><path className="equipment-outline" d="M160 50 v16 M171 50 v16 M183 50 v16"/>
      <Marker number={1} x={42} y={39} line="M48 57 L57 79"/><Marker number={2} x={154} y={108} line="M159 89 L168 66"/><Marker number={3} x={303} y={27} line="M283 34 L253 48"/>
    </>;
    case 'tube': return <>
      <rect className="equipment-body" x="50" y="48" width="47" height="40" rx="5"/><path className="equipment-tube" d="M97 69 H167 C230 69 259 111 260 188"/><path className="equipment-line" d="M97 69 H167 C230 69 259 111 260 188"/><path className="equipment-outline" d="M145 58 v22 M157 58 v22 M169 58 v22"/><rect className="equipment-dressing" x="190" y="61" width="35" height="70" rx="8"/>
      <Marker number={1} x={45} y={20} line="M53 39 L64 52"/><Marker number={2} x={306} y={185} line="M286 184 L263 178"/><Marker number={3} x={258} y={35} line="M245 51 L222 73"/>
    </>;
    case 'tracheostomy': return <>
      <path className="equipment-line" d="M47 118 H98 M247 118 H308"/><path className="equipment-line" d="M47 133 H98 M247 133 H308"/>
      <rect className="equipment-body" x="94" y="87" width="158" height="74" rx="20"/><rect className="equipment-outline" x="108" y="109" width="17" height="30" rx="5"/><rect className="equipment-outline" x="221" y="109" width="17" height="30" rx="5"/>
      <path className="equipment-tube" d="M172 77 V144 C172 174 186 196 222 196"/><path className="equipment-line" d="M172 77 V144 C172 174 186 196 222 196"/><rect className="equipment-body" x="153" y="51" width="38" height="30" rx="5"/>
      <Marker number={1} x={268} y={207} line="M249 202 L219 193"/><Marker number={2} x={112} y={49} line="M117 68 L128 88"/><Marker number={3} x={316} y={83} line="M308 102 L299 119"/>
    </>;
    case 'interfaces': return <>
      <Cannula x={21} y={35} scale={0.84}/>
      <path className="equipment-body" d="M236 67 C215 76 213 114 211 130 Q237 156 267 130 C264 112 264 79 246 67 Z"/><path className="equipment-outline" d="M225 84 l-20 -14 M254 84 l20 -14 M223 113 h7 M249 113 h7"/><path className="equipment-line" d="M239 142 V193"/>
      <Marker number={1} x={47} y={24} line="M54 43 L67 59"/><Marker number={2} x={305} y={95} line="M286 103 L263 110"/><Marker number={3} x={164} y={205} line="M144 201 L82 157"/>
    </>;
  }
}

export default function EquipmentIllustration({ moduleId, topicTitle }: { moduleId: string; topicTitle: string }) {
  const prefix = useId();
  const diagram = equipmentDiagrams.find(item => item.moduleId === moduleId && item.topicTitle === topicTitle);
  if (!diagram) return null;
  return <figure className="equipment-figure" aria-labelledby={`${prefix}-title`}>
    <figcaption>
      <h3 id={`${prefix}-title`}>Reconheça as partes</h3>
      <p>Esquema educativo, não representa modelo específico.</p>
    </figcaption>
    <svg className="equipment-diagram" viewBox="0 0 360 240" role="img" aria-labelledby={`${prefix}-svg-title ${prefix}-svg-description`}>
      <title id={`${prefix}-svg-title`}>{`${diagram.topicTitle}: partes numeradas`}</title>
      <desc id={`${prefix}-svg-description`}>{`${diagram.description} ${diagram.parts.map((part, index) => `${index + 1}: ${part.name}.`).join(' ')}`}</desc>
      <DiagramDrawing kind={diagram.kind}/>
    </svg>
    <p className="equipment-description">{diagram.description}</p>
    <ol className="equipment-parts" aria-label={`Legenda de ${diagram.topicTitle}`}>
      {diagram.parts.map((part, index) => <li key={part.name}><span className="equipment-part-number" aria-hidden="true">{index + 1}</span><div><strong>{part.name}</strong><p>{part.detail}</p></div></li>)}
    </ol>
    <div className="equipment-attention"><Eye size={19} aria-hidden="true"/><p><strong>Para observar com a equipe:</strong> {diagram.attention}</p></div>
    <p className="equipment-description">Base: tópico “{diagram.topicTitle}” do módulo {moduleId === 'equipamentos' ? 'Equipamentos hospitalares' : 'Dispositivos'}. O desenho é uma adaptação educativa original; a leitura abaixo complementa o estudo.</p>
    <a className="equipment-source" {...pdfReaderLink(diagram.source.href)}>Leitura complementar: {diagram.source.label} <ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (abre em outra aba)</span></a>
    <p className="equipment-review">Desenho original para estudo · conteúdo e representação sujeitos à revisão clínica e institucional.</p>
  </figure>;
}
