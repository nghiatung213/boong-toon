import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils/cn";

interface NovelContentProps {
  markdown: string;
  fontFamily: "sans" | "serif";
  fontSize: number;
}

export function NovelContent({
  markdown,
  fontFamily,
  fontSize,
}: NovelContentProps) {
  return (
    <article
      className={cn(
        "reader-content",
        fontFamily === "serif" && "font-serif",
      )}
      style={{ fontSize: `${fontSize}rem` }}
    >
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <span className="my-6 block w-full">
                <span className="relative mx-auto block aspect-[4/3] max-h-[70vh] w-full max-w-2xl overflow-hidden rounded-xl shadow-[var(--shadow)]">
                  <Image
                    src={src}
                    alt={alt ?? ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 672px"
                    loading="lazy"
                    unoptimized={src.startsWith("/uploads/")}
                  />
                </span>
              </span>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
