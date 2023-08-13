import { TimeTable } from "./timetable";
import { Header } from "../../components/header";

export function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />
      <TimeTable />
    </main>
  )
}