import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Perfil from "./pages/Perfil";
import Equipe from "./pages/missoes/Equipe";
import MissoesDashboard from "./pages/missoes/Dashboard";
import MissoesAgenda from "./pages/missoes/Agenda";
import MissoesAtas from "./pages/missoes/Atas";
import MissoesCampanhas from "./pages/missoes/Campanhas";
import MissoesConfiguracoes from "./pages/missoes/Configuracoes";
import MissoesConvertidos from "./pages/missoes/Convertidos";
import MissoesDiscipulado from "./pages/missoes/Discipulado";
import MissoesLocais from "./pages/missoes/Locais";
import MissoesMissionarios from "./pages/missoes/Missionarios";
import MissoesMundiais from "./pages/missoes/Mundiais";
import MissoesNacionais from "./pages/missoes/Nacionais";
import MissoesProjetos from "./pages/missoes/Projetos";
import MissoesRibeirinhas from "./pages/missoes/Ribeirinhas";
import MissoesTesouraria from "./pages/missoes/Tesouraria";
import MissoesTreinamento from "./pages/missoes/Treinamento";
import MissoesVisitantes from "./pages/missoes/Visitantes";
import Dashboard from "./pages/crm/Dashboard";
import People from "./pages/crm/People";
import Pipeline from "./pages/crm/Pipeline";
import Activities from "./pages/crm/Activities";
import Tasks from "./pages/crm/Tasks";
import Agenda from "./pages/crm/Agenda";
import Campaigns from "./pages/crm/Campaigns";
import Finance from "./pages/crm/Finance";
import Reports from "./pages/crm/Reports";
import SettingsPage from "./pages/crm/Settings";

const queryClient = new QueryClient();

const P = ({ children }: { children: JSX.Element }) => <ProtectedRoute>{children}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<P><Dashboard /></P>} />
            <Route path="/pessoas" element={<P><People /></P>} />
            <Route path="/pipeline" element={<P><Pipeline /></P>} />
            <Route path="/atividades" element={<P><Activities /></P>} />
            <Route path="/tarefas" element={<P><Tasks /></P>} />
            <Route path="/perfil" element={<P><Perfil /></P>} />
            <Route path="/agenda" element={<P><Agenda /></P>} />
            <Route path="/campanhas" element={<P><Campaigns /></P>} />
            <Route path="/financeiro" element={<P><Finance /></P>} />
            <Route path="/relatorios" element={<P><Reports /></P>} />
            <Route path="/equipe" element={<P><Equipe /></P>} />
            <Route path="/configuracoes" element={<P><SettingsPage /></P>} />
            <Route path="/missoes" element={<P><MissoesDashboard /></P>} />
            <Route path="/missoes/locais" element={<P><MissoesLocais /></P>} />
            <Route path="/missoes/ribeirinhas" element={<P><MissoesRibeirinhas /></P>} />
            <Route path="/missoes/nacionais" element={<P><MissoesNacionais /></P>} />
            <Route path="/missoes/mundiais" element={<P><MissoesMundiais /></P>} />
            <Route path="/missoes/projetos" element={<P><MissoesProjetos /></P>} />
            <Route path="/missoes/missionarios" element={<P><MissoesMissionarios /></P>} />
            <Route path="/missoes/convertidos" element={<P><MissoesConvertidos /></P>} />
            <Route path="/missoes/visitantes" element={<P><MissoesVisitantes /></P>} />
            <Route path="/missoes/discipulado" element={<P><MissoesDiscipulado /></P>} />
            <Route path="/missoes/treinamento" element={<P><MissoesTreinamento /></P>} />
            <Route path="/missoes/agenda" element={<P><MissoesAgenda /></P>} />
            <Route path="/missoes/campanhas" element={<P><MissoesCampanhas /></P>} />
            <Route path="/missoes/tesouraria" element={<P><MissoesTesouraria /></P>} />
            <Route path="/missoes/atas" element={<P><MissoesAtas /></P>} />
            <Route path="/missoes/configuracoes" element={<P><MissoesConfiguracoes /></P>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
