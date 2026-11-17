import { useEffect, useState } from "react";
export default function InstallHint() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const installed =
      matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;
    if (installed) return;
    try {
      if (localStorage.getItem("cti-install-hint-v1")) return;
      localStorage.setItem("cti-install-hint-v1", "shown");
      setVisible(true);
    } catch {
      /* Sem persistência, deixe as instruções no rodapé para não insistir. */
    }
  }, []);
  return visible ? (
    <aside className="install-hint" aria-label="Instalação no celular">
      <p>
        Leve o CTI Conecta: no iPhone, Compartilhar → Adicionar à Tela de
        Início. No Android, menu do Chrome → Instalar aplicativo.
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dispensar orientação de instalação"
      >
        Entendi
      </button>
    </aside>
  ) : null;
}
