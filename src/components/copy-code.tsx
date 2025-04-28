// @ts-nocheck
import { oklch, parse } from "culori";

import { CheckCheck, Copy } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const tabs = ["v4", "v3"];

export default function CopyCode() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const v4PreRef = React.useRef<React.ElementRef<"pre">>(null);
  const v3PreRef = React.useRef<React.ElementRef<"pre">>(null);

  const [tabValue, setTabValue] = React.useState<(typeof tabs)[number]>("v4");

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Copy Code</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Theme</DialogTitle>
            <DialogDescription>
              Copy and paste the following code into your CSS file.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value={tabs[0]}>Tailwind V4</TabsTrigger>
                <TabsTrigger value={tabs[1]}>V3</TabsTrigger>
              </TabsList>
              <TabsContent value={tabs[0]}>
                <CustomizerCode preRef={v4PreRef} usesOklch />
              </TabsContent>
              <TabsContent value={tabs[1]}>
                <CustomizerCode preRef={v3PreRef} />
              </TabsContent>
            </Tabs>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  (tabValue === tabs[0] ? v4PreRef : v3PreRef).current
                    ?.innerText || "",
                );
                setHasCopied(true);
              }}
              className={cn(
                "absolute right-4 top-1",
                "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground",
              )}
            >
              {hasCopied ? (
                <CheckCheck className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const CustomizerCode: React.FC<{
  preRef: React.RefObject<React.ElementRef<"pre">>;
  usesOklch?: boolean;
}> = ({ preRef, usesOklch }) => {
  const iframes = document.querySelectorAll("iframe");
  let mapper = (v: string) => v.trim();
  if (usesOklch) {
    mapper = (v: string) => {
      const t = v.trim();
      const hslValue = t.match(/:\s+(.+)/)?.[1];
      if (!hslValue) return v;
      const { l = 0, c = 0, h = 0 } = oklch(parse(`hsl(${hslValue})`));
      const lch = [l, c, h]
        .map((v) => Number.parseFloat(v.toFixed(3)))
        .join(" ");
      return t.replace(/:\s+.+/, `: oklch(${lch})`);
    };
  }
  const lightVars = iframes[0]?.contentWindow?.document.documentElement
    .getAttribute("style")
    ?.split(";")
    .map(mapper)
    .filter((v) => v.length);
  const darkVars = iframes[1].contentWindow?.document.documentElement
    .getAttribute("style")
    ?.split(";")
    .map(mapper)
    .filter((v) => v.length);

  if (!lightVars && !darkVars)
    return <p className="destructive">Impossible error occurred!</p>;

  return (
    <div className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 font-mono text-sm">
      <pre ref={preRef} className="text-wrap">
        <code className="line text-white">@layer base &#123;</code>
        <code className="line text-white">&nbsp;&nbsp;:root &#123;</code>
        {lightVars?.map((v) => (
          <code className="line text-white" key={v}>
            &nbsp;&nbsp;&nbsp;&nbsp;{v}&#x3b;
          </code>
        ))}
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--radius: 0.5rem;
        </code>
        <code className="line text-white">&nbsp;&nbsp;&#125;</code>
        <code className="line text-white">&nbsp;</code>
        <code className="line text-white">&nbsp;&nbsp;.dark &#123;</code>
        {darkVars?.map((v) => (
          <code className="line text-white" key={v}>
            &nbsp;&nbsp;&nbsp;&nbsp;{v}&#x3b;
          </code>
        ))}
        <code className="line text-white">&nbsp;&nbsp;&#125;</code>
        <code className="line text-white">&#125;</code>
      </pre>
    </div>
  );
};
