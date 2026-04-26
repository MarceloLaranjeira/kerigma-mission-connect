import { useState } from "react";
import { Edit, Flame, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CrmHero } from "@/components/crm/CrmHero";
import { CampaignFormDialog } from "@/components/crm/CampaignFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmCampaigns, useLookupMaps, type CampaignWithOwner } from "@/hooks/use-crm";
import { formatCurrency, formatDate, frontLabel } from "@/lib/crm";

export default function Campaigns() {
  const { canEdit } = useAuth();
  const { items, loading, create, update, remove } = useCrmCampaigns();
  const { profiles } = useLookupMaps();
  const [editing, setEditing] = useState<CampaignWithOwner | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <AppLayout greeting="Campanhas">
      <CrmHero
        eyebrow="Campanhas"
        title="Ações missionárias com meta, frente, período e liderança claros."
        description="As campanhas conectam pessoas, eventos e orçamento sem virar registros soltos pelo sistema."
        actions={canEdit ? <Button className="bg-white text-primary hover:bg-white/90" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Nova campanha</Button> : null}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? <Card className="p-6">Carregando campanhas...</Card> : null}
        {items.map((campaign) => (
          <Card key={campaign.id} className="border-border/60 bg-gradient-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <Badge variant="secondary">{campaign.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{campaign.description || "Sem descrição adicional."}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{frontLabel(campaign.front)}</span>
                  <span>{campaign.starts_at ? formatDate(campaign.starts_at) : "Sem início"}</span>
                  <span>{campaign.owner_user?.full_name || "Sem responsável"}</span>
                  <span>{formatCurrency(campaign.goal_amount)}</span>
                </div>
              </div>
              {canEdit ? (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(campaign); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => void remove(campaign.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <CampaignFormDialog open={open} onOpenChange={setOpen} initial={editing} profiles={profiles} onSubmit={async (payload) => editing ? update(editing.id, payload) : create(payload)} />
    </AppLayout>
  );
}
