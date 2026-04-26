import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Perfil from "./pages/Perfil";
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
            <Route path="/" element={<P><Index /></P>} />
            <Route path="/perfil" element={<P><Perfil /></P>} />
            <Route path="/agenda" element={<P><Agenda /></P>} />
            <Route path="/locais" element={<P><Locais /></P>} />
            <Route path="/ribeirinhas" element={<P><Ribeirinhas /></P>} />
            <Route path="/nacionais" element={<P><Nacionais /></P>} />
            <Route path="/mundiais" element={<P><Mundiais /></P>} />
            <Route path="/convertidos" element={<P><Convertidos /></P>} />
            <Route path="/visitantes" element={<P><Visitantes /></P>} />
            <Route path="/discipulado" element={<P><Discipulado /></P>} />
            <Route path="/treinamento" element={<P><Treinamento /></P>} />
            <Route path="/missionarios" element={<P><Missionarios /></P>} />
            <Route path="/projetos" element={<P><Projetos /></P>} />
            <Route path="/campanhas" element={<P><Campanhas /></P>} />
            <Route path="/tesouraria" element={<P><Tesouraria /></P>} />
            <Route path="/atas" element={<P><Atas /></P>} />
            <Route path="/equipe" element={<P><Equipe /></P>} />
            <Route path="/configuracoes" element={<P><Configuracoes /></P>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
