
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuestionsProvider } from "@/context/QuestionsContext";
import Index from "./pages/Index";
import QuickGame from "./pages/QuickGame";
import CreateGame from "./pages/CreateGame";
import OnlineGame from "./pages/OnlineGame";
import CreateQuestions from "./pages/CreateQuestions";
import VoteHistory from "./pages/VoteHistory";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import JoinGame from "./pages/JoinGame";
import JoinQuickGame from "./pages/JoinQuickGame";
import PlayerNameSetup from "./pages/PlayerNameSetup";
import WaitingRoom from "./pages/WaitingRoom";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionsProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quick-game" element={<QuickGame />} />
              <Route path="/create-game" element={<CreateGame />} />
              <Route path="/online-game" element={<OnlineGame />} />
              <Route path="/create-questions" element={<CreateQuestions />} />
              <Route path="/vote-history" element={<VoteHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/join/:gameCode" element={<JoinGame />} />
              <Route path="/join-quick/:gameCode" element={<JoinQuickGame />} />
              <Route path="/player-name-setup/:gameCode" element={<PlayerNameSetup />} />
              <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
              <Route path="/play/:gameCode" element={<PlayGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuestionsProvider>
    </QueryClientProvider>
  );
}

export default App;
