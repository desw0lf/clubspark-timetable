import { TimeTable } from "./timetable";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";

export function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="container relative">
          <section className="flex flex-col gap-2 px-4 pt-8 md:pt-12 page-header pb-8">
            <TimeTable />
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}