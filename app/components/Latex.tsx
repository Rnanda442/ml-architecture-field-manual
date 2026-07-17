import katex from "katex";

export function Latex({
  children,
  block = false,
  className = ""
}: {
  children: string;
  block?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(children, {
    displayMode: block,
    output: "html",
    strict: false,
    throwOnError: false
  });

  const Tag = block ? "div" : "span";
  return (
    <Tag
      className={`latex ${block ? "latex-block" : ""} ${className}`}
      aria-label={children}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
