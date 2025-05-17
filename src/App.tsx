
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import PlayGame from "./pages/PlayGame";
import WaitingRoom from "./pages/WaitingRoom";
import QuickGame from "./pages/QuickGame";
import CreateQuestions from "./pages/CreateQuestions";
import OnlineGame from "./pages/OnlineGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-game/:gameCode" element={<CreateGame />} />
          <Route path="/join/:gameCode" element={<JoinGame />} />
          <Route path="/play/:gameCode" element={<PlayGame />} />
          <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
          <Route path="/quick-game" element={<QuickGame />} />
          <Route path="/create-questions" element={<CreateQuestions />} />
          <Route path="/online" element={<OnlineGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
