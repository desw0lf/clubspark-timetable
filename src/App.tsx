import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./providers/theme-provider";
import { IdListProvider } from "./providers/id-list-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "./pages/home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function App() {
  return (
    <IdListProvider>
      <ThemeProvider defaultTheme="system" storageKey="cst-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={0}>
            <Home />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </IdListProvider>
  );
}

export default App;
