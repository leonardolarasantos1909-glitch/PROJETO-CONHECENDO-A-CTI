import qrcode from "qrcode-generator";
export default function ProjectQr() {
  const host = location.hostname;
  if (["localhost", "127.0.0.1", "::1"].includes(host))
    return (
      <p>
        O QR Code será exibido com o endereço real quando o aplicativo estiver
        hospedado.
      </p>
    );
  const url = `${location.origin}/`;
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const image = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.createSvgTag({ cellSize: 4, margin: 16, scalable: true }))}`;
  return (
    <section>
      <h2>Compartilhar o CTI Conecta</h2>
      <img
        src={image}
        alt="QR Code para o endereço deste aplicativo"
        width="220"
        height="220"
      />
      <p>
        <a href={url}>{url}</a>
      </p>
      <a href={image} download="cti-conecta-qr.svg">
        Baixar QR Code
      </a>
      <p>
        Confira a abertura do endereço em outro aparelho antes de distribuir.
      </p>
    </section>
  );
}
