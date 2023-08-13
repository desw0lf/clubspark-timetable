import { TimeTable } from "./timetable";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { CalendarIcon } from "@radix-ui/react-icons";

export function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="container relative">
          <section className="flex flex-col gap-2 px-4 pt-8 md:pt-12 page-header pb-8">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>
              <div className="flex items-center space-x-2">
                <div className="grid gap-2">
                  <button className="gap-2 inline-flex items-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[260px] justify-start text-left font-normal" id="date" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R1j9mmkr9hja:" data-state="closed">
                    <CalendarIcon /> Jan 20, 2023 - Feb 09, 2023
                  </button>
                </div>
              {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">Download</button> */}
              </div>
            </div>
            <TimeTable />
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}