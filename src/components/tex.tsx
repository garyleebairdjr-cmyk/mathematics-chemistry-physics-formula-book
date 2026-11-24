import katex from "katex";
import "katex/dist/katex.min.css";

export function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: "html",
    strict: "ignore",
  });

  if (display) {
    return (
      <div className="formula-display overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
