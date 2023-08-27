import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { EditIdList } from "./edit-id-list";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pencil2Icon } from "@radix-ui/react-icons";

export const Header = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">CST</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground" href="/">Timetable</a>
            {/* <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/examples">Examples</a> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <button className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
              2 venues selected
            </button> */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-between text-sm text-muted-foreground md:w-40 lg:w-64">
                Edit venues <Pencil2Icon />
              </SheetTrigger>
              <SheetContent className="h-full pr-0 pb-0">
                <SheetHeader className="h-full">
                  <SheetTitle>Edit venues</SheetTitle>
                  <SheetDescription asChild>
                    <EditIdList setSheetOpen={setSheetOpen} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}