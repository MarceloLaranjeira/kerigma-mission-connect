import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Locais from "./pages/missoes/Locais";
import Ribeirinhas from "./pages/missoes/Ribeirinhas";
import Nacionais from "./pages/missoes/Nacionais";
import Mundiais from "./pages/missoes/Mundiais";
import Convertidos from "./pages/missoes/Convertidos";
import Visitantes from "./pages/missoes/Visitantes";
import Discipulado from "./pages/missoes/Discipulado";
import Treinamento from "./pages/missoes/Treinamento";
import Missionarios from "./pages/missoes/Missionarios";
import Projetos from "./pages/missoes/Projetos";
import Campanhas from "./pages/missoes/Campanhas";
import Tesouraria from "./pages/missoes/Tesouraria";
import Atas from "./pages/missoes/Atas";
import Equipe from "./pages/missoes/Equipe";
import Agenda from "./pages/missoes/Agenda";
import Configuracoes from "./pages/missoes/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/locais" element={<Locais />} />
          <Route path="/ribeirinhas" element={<Ribeirinhas />} />
          <Route path="/nacionais" element={<Nacionais />} />
          <Route path="/mundiais" element={<Mundiais />} />
          <Route path="/convertidos" element={<Convertidos />} />
          <Route path="/visitantes" element={<Visitantes />} />
          <Route path="/discipulado" element={<Discipulado />} />
          <Route path="/treinamento" element={<Treinamento />} />
          <Route path="/missionarios" element={<Missionarios />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/tesouraria" element={<Tesouraria />} />
          <Route path="/atas" element={<Atas />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
