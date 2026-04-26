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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
