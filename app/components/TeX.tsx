import { useState } from "react";
import KaTeX, { type KatexOptions } from "katex";
import "katex/dist/katex.min.css";

export function TeX({
  children,
  options = undefined,
}: {
  children: string;
  options?: KatexOptions;
}) {
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);

  if (ref) {
    KaTeX.render(children, ref, options);
  }

  return <span ref={(newRef) => setRef(newRef)} />;
}
