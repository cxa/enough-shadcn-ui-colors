import { CheckCheck, Copy } from "lucide-react";
import React from "react";
import { type ColorVars, genVars } from "~/lib/color";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function CopyCode() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const preRef = React.useRef<React.ElementRef<"pre">>(null);

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
            <CustomizerCode preRef={preRef} />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(preRef.current?.innerText || "");
                setHasCopied(true);
              }}
              className="absolute right-4 top-4 bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
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

const CustomizerCode = ({
  preRef,
}: { preRef: React.RefObject<React.ElementRef<"pre">> }) => {
  const [h, ls, ll, ds, dl] = window.location.hash
    .substring(1)
    .split(",")
    .map((s) => Number.parseInt(s));
  const lightTheme = genVars({ h, s: ls / 100, l: ll / 100 });
  const darkTheme = genVars({ h, s: ds / 100, l: dl / 100 }, true);

  return (
    <div className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 font-mono text-sm">
      <pre ref={preRef} className="text-wrap">
        <code className="line text-white">@layer base &#123;</code>
        <code className="line text-white">&nbsp;&nbsp;:root &#123;</code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--background: {lightTheme?.background}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {lightTheme.foreground}&#x3b;
        </code>
        {[
          "card",
          "popover",
          "primary",
          "secondary",
          "muted",
          "accent",
          "destructive",
        ].map((prefix) => (
          <React.Fragment key={prefix}>
            <code className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
              {lightTheme?.[prefix as keyof ColorVars]}&#x3b;
            </code>
            <code className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
              {lightTheme?.[`${prefix}-foreground` as keyof ColorVars]}&#x3b;
            </code>
          </React.Fragment>
        ))}
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--border: {lightTheme?.border}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--input: {lightTheme?.input}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--ring: {lightTheme?.ring}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--radius: 0.5rem;
        </code>
        <code className="line text-white">&nbsp;&nbsp;&#125;</code>
        <code className="line text-white">&nbsp;</code>
        <code className="line text-white">&nbsp;&nbsp;.dark &#123;</code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--background: {darkTheme?.background}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {darkTheme?.foreground}&#x3b;
        </code>
        {[
          "card",
          "popover",
          "primary",
          "secondary",
          "muted",
          "accent",
          "destructive",
        ].map((prefix) => (
          <React.Fragment key={prefix}>
            <code className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
              {darkTheme?.[prefix as keyof ColorVars]}&#x3b;
            </code>
            <code className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
              {darkTheme?.[`${prefix}-foreground` as keyof ColorVars]}&#x3b;
            </code>
          </React.Fragment>
        ))}
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--border: {darkTheme?.border}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--input: {darkTheme?.input}&#x3b;
        </code>
        <code className="line text-white">
          &nbsp;&nbsp;&nbsp;&nbsp;--ring: {darkTheme?.ring}&#x3b;
        </code>
        <code className="line text-white">&nbsp;&nbsp;&#125;</code>
        <code className="line text-white">&#125;</code>
      </pre>
    </div>
  );
};
