import { cp, mkdir } from "node:fs/promises";
for (const directory of ["cmaps", "standard_fonts", "wasm"]) {
  await mkdir("public/pdfjs", { recursive: true });
  await cp(
    `node_modules/pdfjs-dist/${directory}`,
    `public/pdfjs/${directory}`,
    { recursive: true },
  );
}

// Keep license notices beside redistributed local fonts and PDF assets.
const { readdir, readFile, writeFile } = await import("node:fs/promises");
await mkdir("public/licenses", { recursive: true });
for (const name of [
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  "lucide-react",
  "pdfjs-dist",
  "@fontsource/inter",
  "@fontsource/poppins",
]) {
  const files = (await readdir(`node_modules/${name}`)).filter((file) =>
    /^licen[cs]e(?:\.|$)/i.test(file),
  );
  if (files.length === 0) throw new Error(`License notice missing for ${name}`);
  for (const file of files)
    await cp(
      `node_modules/${name}/${file}`,
      `public/licenses/${name.replaceAll("/", "-").replaceAll("@", "")}-${file}`,
    );
}
const mit = await readFile("node_modules/react/LICENSE", "utf8");
await writeFile(
  "public/licenses/qrcode-generator-MIT.txt",
  mit.replace(
    "Copyright (c) Meta Platforms, Inc. and affiliates.",
    "Copyright (c) 2009 Kazuhiko Arase\nQR Code Generator for JavaScript — http://www.d-project.com/",
  ),
);
