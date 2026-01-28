import Link from "next/link";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { createElement, type ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";
import { cn } from "@/utils/cn";
import { ClientMediaPlayer } from "./media-player/client-media-player";
import {
  ScrollSpy,
  ScrollSpyLink,
  ScrollSpyNav,
  ScrollSpySection,
  ScrollSpyViewport,
} from "./scroll-spy";

const parseNumericDimension = (
  value: ComponentPropsWithoutRef<"img">["width"]
) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsedNumber = Number(value);
    if (Number.isFinite(parsedNumber)) return parsedNumber;
  }
  return undefined;
};

const isAllowedNextImageRemoteSource = (source: string) => {
  if (!source.startsWith("http")) return true;
  try {
    const url = new URL(source);
    return url.hostname === "sentra.app" || url.hostname === "www.sentra.app";
  } catch {
    return false;
  }
};

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="scroll-mt-28 text-3xl/snug font-medium tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => {
    const headingId = typeof props.id === "string" ? props.id : undefined;

    if (!headingId) {
      return (
        <h2 className="scroll-mt-28 text-xl font-medium tracking-tight text-foreground" {...props} />
      );
    }

    return (
      <ScrollSpySection asChild value={headingId}>
        <h2 className="scroll-mt-28 text-xl font-medium tracking-tight text-foreground" {...props} />
      </ScrollSpySection>
    );
  },
  h3: (props: ComponentPropsWithoutRef<"h3">) => {
    const headingId = typeof props.id === "string" ? props.id : undefined;

    if (!headingId) {
      return (
        <h3 className="scroll-mt-28 text-lg font-medium tracking-tight text-foreground" {...props} />
      );
    }

    return (
      <ScrollSpySection asChild value={headingId}>
        <h3 className="scroll-mt-28 text-lg font-medium tracking-tight text-foreground" {...props} />
      </ScrollSpySection>
    );
  },
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="scroll-mt-28 text-base font-medium tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-base leading-7 text-foreground/80" {...props} />
  ),
  a: ({
    href,
    ...props
  }: ComponentPropsWithoutRef<"a"> & { href?: string }) => {
    const isInternal = typeof href === "string" && href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-foreground underline underline-offset-4 hover:opacity-80 duration-200"
          {...props}
        />
      );
    }

    return (
      <a
        href={href}
        className="text-foreground underline underline-offset-4 hover:opacity-80 duration-200"
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    );
  },
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="text-base text-foreground/80 list-disc pl-5 space-y-2"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="text-base text-foreground/80 list-decimal pl-5 space-y-2"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-foreground/80" {...props} />
  ),
  code: ({ children, ...props }) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-border/60 pl-4 italic text-foreground/80"
      {...props}
    />
  ),
  img: ({
    alt,
    className,
    height,
    src,
    width,
    ...rest
  }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string" || src.length === 0) return null;

    const numericWidth = parseNumericDimension(width);
    const numericHeight = parseNumericDimension(height);

    if (typeof numericWidth === "number" && typeof numericHeight === "number") {
      return (
        <Image
          src={src}
          alt={alt ?? ""}
          width={numericWidth}
          height={numericHeight}
          sizes="100vw"
          className={cn("w-full h-auto", className)}
          {...rest}
        />
      );
    }

    if (!isAllowedNextImageRemoteSource(src)) {
      return createElement("img", {
        src,
        alt: alt ?? "",
        className: cn("w-full h-auto", className),
        ...rest,
      });
    }

    return (
      <span className="relative block w-full aspect-video">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="100vw"
          className={cn("object-contain", className)}
          {...rest}
        />
      </span>
    );
  },
  MediaPlayer: ClientMediaPlayer,
  ScrollSpy,
  ScrollSpyLink,
  ScrollSpyNav,
  ScrollSpySection,
  ScrollSpyViewport,
} satisfies MDXComponents;
