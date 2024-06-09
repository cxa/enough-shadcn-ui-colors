import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";

export default function Controls() {
  return (
    <>
      <div className={cn("flex gap-5 flex-row flex-wrap justify-center")}>
        <div className="grid gap-5 grid-cols-2 place-items-center">
          <Switch defaultChecked />
          <Switch />
        </div>
        <div className="grid gap-5 grid-cols-2 place-items-center">
          <Checkbox defaultChecked />
          <Checkbox />
        </div>
        <RadioGroup
          className="grid gap-5 grid-cols-2 place-items-center"
          value="1"
        >
          <RadioGroupItem defaultChecked value="1" />
          <RadioGroupItem value="2" />
        </RadioGroup>
      </div>

      <div className={cn("flex gap-5 flex-row flex-wrap justify-center")}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </>
  );
}
