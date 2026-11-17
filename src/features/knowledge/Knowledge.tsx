import { useState } from "react";
import { modules, sources } from "../../content";
import { normalizeSearch } from "../../search";
import { topicHref, topicFavoriteId } from "../../favorites";
import { FavoriteButton } from "../../Favorites";
import { readSavedIds, writeSavedIds } from "../../learning-storage";
export function Clinical() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todas");
  const categories = modules.filter(
    (m) => !["quiz", "biblioteca"].includes(m.id),
  );
  const terms = query.trim().split(/\s+/).map(normalizeSearch);
  return (
    <section>
      <h1 className="page-title">Enciclopédia clínica</h1>
      <p>
        Índice pesquisável dos conteúdos disponíveis. Introduções educativas,
        com revisão clínica pendente; não são fichas clínicas validadas.
      </p>
      <div className="tool-form">
        <label>
          Nome, sigla ou sinônimo
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Categoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Todas</option>
            {categories.map((m) => (
              <option key={m.id}>{m.title}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="topic-grid">
        {categories
          .filter((m) => category === "Todas" || category === m.title)
          .flatMap((m) =>
            m.topics
              .filter((t) =>
                terms.every((q) =>
                  normalizeSearch(
                    [t.title, t.purpose, t.care, t.risk].join(" "),
                  ).includes(q),
                ),
              )
              .map((t) => (
                <article className="panel" key={`${m.id}-${t.title}`}>
                  <span className="eyebrow">{m.title} · DEFINIÇÃO BREVE</span>
                  <h2>{t.title}</h2>
                  <p>{t.purpose}</p>
                  <p className="muted">
                    Revisão clínica pendente · Fontes de consulta na biblioteca;
                    validação individual pendente.
                  </p>
                  <a className="button" href={topicHref(m.id, t.title)}>
                    Abrir conteúdo disponível
                  </a>
                  <FavoriteButton id={topicFavoriteId(m.id, t.title)} />
                </article>
              )),
          )}
      </div>
      <p>
        Não encontrou um tema? A base pode ser ampliada com fichas e fontes
        fornecidas para revisão.
      </p>
      <a href="#biblioteca">Fontes disponíveis ({sources.length})</a>
    </section>
  );
}
export function Dilution() {
  const [query, setQuery] = useState("");
  return (
    <section className="panel">
      <h1>Tabela institucional de diluição</h1>
      <label>
        Medicamento ou apresentação
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p role="status">
        A tabela institucional ainda precisa ser fornecida. Nenhum medicamento,
        unidade, concentração ou observação foi preenchido por inferência.
      </p>
      <p>
        Diluição não demonstra compatibilidade entre medicamentos. A consulta
        estará disponível após inclusão e conferência da tabela original.
      </p>
    </section>
  );
}
const integration = [
  {
    id: "responsavel",
    title:
      "Identificar o responsável pela integração e combinar o acompanhamento.",
  },
  {
    id: "protocolos",
    title:
      "Localizar os protocolos vigentes e os canais de consulta da instituição.",
  },
  {
    id: "fluxos",
    title: "Conhecer os fluxos do setor com o profissional responsável.",
  },
  {
    id: "duvidas",
    title: "Registrar dúvidas de estudo sem dados identificáveis de pacientes.",
  },
];
export function Integration() {
  const [checked, setChecked] = useState(() =>
    readSavedIds(
      "cti-integration-v1",
      integration.map((x) => x.id),
    ),
  );
  return (
    <section className="panel">
      <h1>Checklist de integração</h1>
      <p>
        Roteiro organizacional para estagiários e novos colaboradores, a adaptar
        com o responsável pelo setor.
      </p>
      {integration.map((item) => (
        <label className="integration-item" key={item.id}>
          <input
            type="checkbox"
            checked={checked.includes(item.id)}
            onChange={() => {
              const next = checked.includes(item.id)
                ? checked.filter((x) => x !== item.id)
                : [...checked, item.id];
              setChecked(next);
              writeSavedIds("cti-integration-v1", next);
            }}
          />
          {item.title}
        </label>
      ))}
    </section>
  );
}
export function VirtualCti() {
  return (
    <section className="panel">
      <h1>CTI virtual educativo</h1>
      <p>
        Explore os elementos de um ambiente de terapia intensiva nos módulos
        existentes. Este índice educativo não simula equipamentos reais nem
        certifica habilidades.
      </p>
      <div className="topic-grid">
        {modules
          .filter((m) =>
            ["equipamentos", "dispositivos", "rotinas", "acolhimento"].includes(
              m.id,
            ),
          )
          .map((m) => (
            <a key={m.id} className="topic-card" href={`#${m.id}`}>
              <h2>{m.title}</h2>
              <p>{m.description}</p>
            </a>
          ))}
      </div>
    </section>
  );
}
