import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{ slug: string }>;
}

interface OklchColor {
  lightness: number;
  chroma: number;
  hue: number;
}

const clampNumber = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const linearToSrgb = (value: number) => {
  const clampedValue = clampNumber(value, 0, 1);
  if (clampedValue <= 0.0031308) return 12.92 * clampedValue;
  return 1.055 * clampedValue ** (1 / 2.4) - 0.055;
};

const oklchToRgbString = (oklch: OklchColor) => {
  const hueRadians = (oklch.hue * Math.PI) / 180;
  const a = oklch.chroma * Math.cos(hueRadians);
  const b = oklch.chroma * Math.sin(hueRadians);

  const l_ = oklch.lightness + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = oklch.lightness - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = oklch.lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const linearRed = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const linearGreen =
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const linearBlue =
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const srgbRed = Math.round(linearToSrgb(linearRed) * 255);
  const srgbGreen = Math.round(linearToSrgb(linearGreen) * 255);
  const srgbBlue = Math.round(linearToSrgb(linearBlue) * 255);

  return `rgb(${srgbRed}, ${srgbGreen}, ${srgbBlue})`;
};

const heroBrandOklch: OklchColor = {
  lightness: 0.685,
  chroma: 0.169,
  hue: 237.325,
};

const heroPrimary700Oklch: OklchColor = {
  lightness: 0.391,
  chroma: 0.09,
  hue: 240.876,
};

const readPublicPngAsDataUrl = async (relativePath: string) => {
  const filePath = path.join(process.cwd(), "public", relativePath);
  const fileBytes = await fs.readFile(filePath);
  return `data:image/png;base64,${fileBytes.toString("base64")}`;
};

const OpenGraphImage = async ({ params }: OpenGraphImageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title =
    post?.metadata.title && post.metadata.title.length > 0
      ? post.metadata.title
      : "Sentra Blog";
  const category = post?.metadata.category;
  const date = post?.metadata.date;

  const subtitleParts = [category, date].filter(
    (value): value is string => typeof value === "string" && value.length > 0
  );
  const subtitle = subtitleParts.join(" · ");

  const brandColor = oklchToRgbString(heroBrandOklch);
  const primary700Color = oklchToRgbString(heroPrimary700Oklch);
  const logoDataUrl = await readPublicPngAsDataUrl("sentra.png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: `linear-gradient(to top right, ${brandColor} 0%, ${primary700Color} 15%, #000000 40%)`,
          color: "#FFFFFF",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "2px 2px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: 0.95,
            }}
          >
            <img
              src={logoDataUrl}
              width={44}
              height={44}
              alt="Sentra"
              style={{ display: "block" }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              Sentra
            </div>
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: 980,
              whiteSpace: "pre-wrap",
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            position: "relative",
          }}
        >
          <div style={{ fontSize: 26, opacity: 0.85, fontWeight: 500 }}>
            {subtitle.length > 0 ? subtitle : "sentra.app/blog"}
          </div>
          <div style={{ fontSize: 26, opacity: 0.85, fontWeight: 500 }}>
            sentra.app
          </div>
        </div>
      </div>
    ),
    size
  );
};

export default OpenGraphImage;


