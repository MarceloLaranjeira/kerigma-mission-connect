import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Clock } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (profile?.status === "pendente") {
    return (
      <AppLayout greeting="Aguardando aprovação">
        <Card className="p-10 text-center bg-gradient-card border-border/60 shadow-card max-w-xl mx-auto">
          <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold">Cadastro em análise</h2>
          <p className="text-muted-foreground mt-2">
            Olá, {profile?.full_name}! Seu cadastro foi recebido e está aguardando aprovação
            de um Coordenador ou Diretor da Equipe de Missões da IBK.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Você receberá acesso assim que for aprovado.
          </p>
        </Card>
      </AppLayout>
    );
  }

  return <>{children}</>;
}
