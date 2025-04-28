// @ts-nocheck
import { converter, toGamut } from "culori";

type HSL = `${number} ${number | string}% ${number | string}%`;

export type ColorVars = {
  background: HSL;
  foreground: HSL;
  card: HSL;
  "card-foreground": HSL;
  popover: HSL;
  "popover-foreground": HSL;
  primary: HSL;
  "primary-foreground": HSL;
  secondary: HSL;
  "secondary-foreground": HSL;
  muted: HSL;
  "muted-foreground": HSL;
  accent: HSL;
  "accent-foreground": HSL;
  destructive: HSL;
  "destructive-foreground": HSL;
  border: HSL;
  input: HSL;
  ring: HSL;
  "char-1": HSL;
  "char-2": HSL;
  "char-3": HSL;
  "char-4": HSL;
  "char-5": HSL;
  "sidebar-background": HSL;
  "sidebar-foreground": HSL;
  "sidebar-primary": HSL;
  "sidebar-primary-foreground": HSL;
  "sidebar-accent": HSL;
  "sidebar-accent-foreground": HSL;
  "sidebar-border": HSL;
  "sidebar-ring": HSL;
};

const defaults: { light: ColorVars; dark: ColorVars } = {
  light: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    card: "0 0% 100%",
    "card-foreground": "240 10% 3.9%",
    popover: "0 0% 100%",
    "popover-foreground": "240 10% 3.9%",
    primary: "240 5.9% 10%",
    "primary-foreground": "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    "secondary-foreground": "240 5.9% 10%",
    muted: "240 4.8% 95.9%",
    "muted-foreground": "240 3.8% 46.1%",
    accent: "240 4.8% 95.9%",
    "accent-foreground": "240 5.9% 10%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "240 5.9% 10%",
    "chart-1": "12 76% 61% ",
    "chart-2": "173 58% 39%",
    "chart-3": "197 37% 24%",
    "chart-4": "43 74% 66%",
    "chart-5": "27 87% 67%",
    "sidebar-background": "0 0% 98%",
    "sidebar-foreground": "240 5.3% 26.1%",
    "sidebar-primary": "240 5.9% 10%",
    "sidebar-primary-foreground": "0 0% 98%",
    "sidebar-accent": "240 4.8% 95.9%",
    "sidebar-accent-foreground": "240 5.9% 10%",
    "sidebar-border": "220 13% 91%",
    "sidebar-ring": "217.2 91.2% 59.8%",
  },
  dark: {
    background: "240 10% 3.9%",
    foreground: "0 0% 98%",
    card: "240 10% 3.9%",
    "card-foreground": "0 0% 98%",
    popover: "240 10% 3.9%",
    "popover-foreground": "0 0% 98%",
    primary: "0 0% 98%",
    "primary-foreground": "240 5.9% 10%",
    secondary: "240 3.7% 15.9%",
    "secondary-foreground": "0 0% 98%",
    muted: "240 3.7% 15.9%",
    "muted-foreground": "240 5% 64.9%",
    accent: "240 3.7% 15.9%",
    "accent-foreground": "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "0 0% 98%",
    border: "240 3.7% 15.9%",
    input: "240 3.7% 15.9%",
    ring: "240 4.9% 83.9%",
    "chart-1": "220 70% 50% ",
    "chart-2": "160 60% 45%",
    "chart-3": "30 80% 55%",
    "chart-4": "280 65% 60%",
    "chart-5": "340 75% 55%",
    "sidebar-background": "240 5.9% 10%",
    "sidebar-foreground": "240 4.8% 95.9%",
    "sidebar-primary": "224.3 76.3% 48%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-accent": "240 3.7% 15.9%",
    "sidebar-accent-foreground": "240 4.8% 95.9%",
    "sidebar-border": "240 3.7% 15.9%",
    "sidebar-ring": "217.2 91.2% 59.8%",
  },
};

const to_hsl = (color: object): HSL => {
  const { h, s, l } = converter("hsl")(toGamut("okhsl")(color));
  return `${Math.trunc(h)} ${(s * 100).toFixed(2)}% ${(l * 100).toFixed(2)}%`;
};

export const genVars = (
  hsl: {
    h: number;
    s: number;
    l: number;
  },
  isDark?: boolean,
): ColorVars => {
  const okhsl = {
    mode: "okhsl",
    ...hsl,
    l: Math.min(0.99, Math.max(0.01, hsl.l)),
  };
  const d = isDark ? defaults.dark : defaults.light;
  const primary = to_hsl(okhsl);
  const fg =
    okhsl.l > 0.7
      ? isDark
        ? d.background
        : d.foreground
      : isDark
        ? d.foreground
        : d.background;
  let destructive = "";
  let destructiveFg = "";
  if (okhsl.h > 300 || okhsl.h < 60) {
    destructive = to_hsl({
      ...okhsl,
      s: 1,
      l: isDark ? 0.1 : 0.95,
      h: Math.random() * 30,
    });
    destructiveFg = to_hsl({ ...okhsl, s: 1, h: Math.random() * 30 });
  } else {
    destructive = to_hsl({ ...okhsl, s: 1, h: Math.random() * 30 });
    destructiveFg = fg;
  }

  return {
    ...d,
    primary,
    "primary-foreground": fg,
    destructive,
    "destructive-foreground": destructiveFg,
    ring: primary,
    "chart-1": primary,
    "chart-2": adjust_hue(okhsl, 180),
    "chart-3": adjust_hue(okhsl, 240),
    "chart-4": adjust_hue(okhsl, 90),
    "chart-5": adjust_hue(okhsl, 270),
  };
};

export const saturationGradient = (h: number, l: number) => {
  const left = to_hsl({ mode: "okhsl", h, s: 0, l });
  const right = to_hsl({ mode: "okhsl", h, s: 1, l });
  return `linear-gradient(90deg, hsl(${left}) 0%, hsl(${right}) 100%)`;
};

export const lightnessGradient = (h: number, s: number) => {
  const left = to_hsl({ mode: "okhsl", h, s, l: 0.01 });
  const right = to_hsl({ mode: "okhsl", h, s, l: 0.99 });
  return `linear-gradient(90deg, hsl(${left}) 0%, hsl(${right}) 100%)`;
};

const adjust_hue = (base, hue) => {
  const h = (base.h + hue) % 360;
  return to_hsl({ ...base, h });
};
