
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
import Profile from "./pages/Profile";
import VoteHistory from "./pages/VoteHistory";
import Navigation from "./components/layout/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create-game/:gameCode" element={<CreateGame />} />
              <Route path="/join/:gameCode" element={<JoinGame />} />
              <Route path="/play/:gameCode" element={<PlayGame />} />
              <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
              <Route path="/quick-game" element={<QuickGame />} />
              <Route path="/create-questions" element={<CreateQuestions />} />
              <Route path="/online" element={<OnlineGame />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/vote-history/:gameId" element={<VoteHistory />} />
              <Route path="/vote-history" element={<VoteHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
