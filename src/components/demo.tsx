import React from "react";
import { cn } from "~/lib/utils";
import { CardsDataTable } from "./cards/data-table";
import CardsGoal from "./cards/goals";
import CardsPayment from "./cards/payment";
import CardsTeam from "./cards/team";
import Controls from "./controls";
import { Icons } from "./icons";

export default function Demo({ dark }: { dark?: boolean }) {
  React.useEffect(() => {
    document.documentElement.classList.add(dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="p-5 sm:px-10 pb-24">
      <section
        className={cn(
          "mx-auto",
          "flex flex-col items-center gap-2",
          "pt-5 pb-10",
        )}
      >
        <h1
          className={cn(
            "font-thin tracking-wide text-center text-3xl sm:text-4xl md:text-6xl",
            "leading-tight lg:leading-[1.1] text-balance",
          )}
        >
          Enough
        </h1>
        <p
          className={cn(
            "text-muted-foreground",
            "text-center text-lg sm:text-xl",
          )}
        >
          Decent color schemes for your next shadcn/ui project
        </p>
      </section>
      <section className="space-y-10">
        <Controls />
        <div className="flex flex-col sm:flex-row gap-5">
          <CardsGoal />
          <CardsTeam />
        </div>
        <CardsPayment />
        <CardsDataTable />
        <div className="flex justify-center">
          <a
            href="https://github.com/cxa/enough-shadcn-ui-colors"
            target="_blank"
            rel="noreferrer"
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
