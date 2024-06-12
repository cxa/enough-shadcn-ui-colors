import { CheckCheck, Copy } from "lucide-react";
import React from "react";
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
  const iframes = document.querySelectorAll("iframe");
  const lightVars = iframes[0]?.contentWindow?.document.documentElement
    .getAttribute("style")
    ?.split(";")
    .map((v) => v.trim())
    .filter((v) => v.length);
  const darkVars = iframes[1].contentWindow?.document.documentElement
    .getAttribute("style")
    ?.split(";")
    .map((v) => v.trim())
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
