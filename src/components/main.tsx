import React from "react";
import type { HueChangeEventHandler } from "simple-hue-picker";
import HuePicker from "simple-hue-picker/react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { genVars, lightnessGradient, saturationGradient } from "~/lib/color";
import { cn } from "~/lib/utils";
import CopyCode from "./copy-code";

export default function Main() {
  const [h, ls, ll, ds, dl] = window.location.hash
    .substring(1)
    .split(",")
    .map((s) => Number.parseInt(s));
  const [hue, setHue] = React.useState(
    h >= 0 && h <= 360 ? h : Math.trunc(Math.random() * 360),
  );
  const [light, setLight] = React.useState({
    s: ls >= 0 && ls <= 100 ? ls : 100,
    l: ll >= 0 && ls <= 100 ? ll : Math.trunc(Math.random() * 10) + 50,
  });
  const [dark, setDark] = React.useState({
    s: ds >= 0 && ds <= 100 ? ds : 100,
    l: dl >= 0 && ds <= 100 ? dl : Math.trunc(Math.random() * 5) + 50,
  });
  const [showsFineTuning, setFineTuning] = React.useState(false);
  const lightIFrameRef = React.useRef<HTMLIFrameElement>(null);
  const darkIFrameRef = React.useRef<HTMLIFrameElement>(null);

  const updateLightVars = () => {
    const lightDoc = lightIFrameRef.current?.contentWindow?.document;
    if (!lightDoc) return;
    const vars = genVars({ h: hue, s: light.s / 100, l: light.l / 100 });
    for (const [k, v] of Object.entries(vars)) {
      lightDoc.documentElement.style.setProperty(`--${k}`, v);
    }
  };

  const updateDarkVars = () => {
    const darkDoc = darkIFrameRef.current?.contentWindow?.document;
    if (!darkDoc) return;
    const vars = genVars({ h: hue, s: dark.s / 100, l: dark.l / 100 }, true);
    for (const [k, v] of Object.entries(vars)) {
      darkDoc.documentElement.style.setProperty(`--${k}`, v);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  React.useEffect(() => {
    updateLightVars();
  }, [hue, light.l, light.s]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  React.useEffect(() => {
    updateDarkVars();
  }, [hue, dark.l, dark.s]);

  React.useEffect(() => {
    window.location.hash = [hue, light.s, light.l, dark.s, dark.l].join(",");
  }, [hue, light.s, light.l, dark.s, dark.l]);

  const handleHueChange: HueChangeEventHandler = (e) => {
    if (typeof e.detail === "number") setHue(e.detail);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full max-w-screen-2xl",
        "grid grid-rows-[auto_1fr]",
        "mx-auto",
      )}
    >
      <div
        className={cn(
          "flex gap-2 lg:gap-5 justify-center items-center",
          "p-2 pt-[max(0.5rem,_env(safe-area-inset-top))]",
          "lg:p-5 lg:pt-[max(1.25rem,_env(safe-area-inset-top))]",
        )}
      >
        <div className="flex items-center h-10 px-4 bg-secondary rounded-md">
          <HuePicker value={hue} onInput={handleHueChange} />
        </div>
        <CopyCode />
      </div>

      <section
        className={cn(
          "grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2",
          "relative",
        )}
      >
        <Button
          className={cn(
            "absolute z-10 bottom-[calc(50%_-_1.25rem)] lg:bottom-4",
            "left-1/2 w-28 -ml-14",
          )}
          variant="outline"
          onClick={() => setFineTuning((t) => !t)}
        >
          {showsFineTuning ? "Hide" : "Fine Tuning"}
        </Button>

        <div className="relative z-0 size-full overflow-hidden">
          <div
            className={cn(
              "absolute left-0 right-0 px-5",
              "transition-all ",
              showsFineTuning
                ? "bottom-8 lg:bottom-4 ease-in"
                : "-bottom-24 ease-out",
            )}
          >
            <Alert className="max-w-sm mx-auto">
              <AlertDescription className="flex flex-col gap-4 pt-4">
                <Slider
                  value={[light.s]}
                  onValueChange={([s]) => setLight({ ...light, s })}
                  trackBackground={saturationGradient(hue, light.l / 100)}
                />
                <Slider
                  value={[light.l]}
                  onValueChange={([l]) => setLight({ ...light, l })}
                  trackBackground={lightnessGradient(hue, light.s / 100)}
                />
              </AlertDescription>
            </Alert>
          </div>

          <iframe
            src="./?demo"
            title="Demo light"
            className="size-full border-t"
            ref={lightIFrameRef}
            onLoad={updateLightVars}
          />
        </div>
        <div className="relative z-0 size-full overflow-hidden">
          <div
            className={cn(
              "absolute left-0 right-0 px-5",
              "transition-all ",
              showsFineTuning ? "bottom-4 ease-in" : "-bottom-24 ease-out",
            )}
          >
            <Alert className="max-w-sm mx-auto">
              <AlertDescription className="flex flex-col gap-4 pt-4">
                <Slider
                  value={[dark.s]}
                  onValueChange={([s]) => setDark({ ...dark, s })}
                  trackBackground={saturationGradient(hue, dark.l / 100)}
                />
                <Slider
                  value={[dark.l]}
                  onValueChange={([l]) => setDark({ ...dark, l })}
                  trackBackground={lightnessGradient(hue, dark.s / 100)}
                />
              </AlertDescription>
            </Alert>
          </div>
          <iframe
            src="./?demo=dark"
            title="Demo dark"
            className="size-full bg-foreground"
            ref={darkIFrameRef}
            onLoad={updateDarkVars}
          />
        </div>
      </section>
    </div>
  );
}
