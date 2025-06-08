
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartyType, PartySettings } from '@/types/party';
import { useParty } from '@/hooks/useParty';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Settings, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PartyCreationDialogProps {
  gameType: string;
  onPartyCreated?: (party: any) => void;
}

const PartyCreationDialog = ({ gameType, onPartyCreated }: PartyCreationDialogProps) => {
  const { user } = useAuth();
  const { createParty, loading } = useParty();
  const [open, setOpen] = useState(false);
  const [partyType, setPartyType] = useState<PartyType>('private');
  const [settings, setSettings] = useState<PartySettings>({
    maxPlayers: 8,
    timePerTurn: 30,
    numberOfRounds: 10,
    anonymousVoting: false,
    allowJoinAfterStart: false,
    antiCheatEnabled: true,
    passwordProtected: false,
    partyPassword: ''
  });

  const handleCreateParty = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer une partie');
      return;
    }

    try {
      const party = await createParty(gameType, partyType, settings, user.id);
      setOpen(false);
      onPartyCreated?.(party);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Créer une partie
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle partie</DialogTitle>
          <DialogDescription>
            Configurez votre partie selon vos préférences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4">
            <div className="space-y-3">
              <Label>Type de partie</Label>
              <Select value={partyType} onValueChange={(value: PartyType) => setPartyType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Privée (invitation uniquement)
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Publique (matchmaking)
                    </div>
                  </SelectItem>
                  <SelectItem value="mixed">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Mixte (amis + public)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxPlayers">Nombre maximum de joueurs</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="2"
                max="20"
                value={settings.maxPlayers}
                onChange={(e) => setSettings({
                  ...settings,
                  maxPlayers: parseInt(e.target.value) || 8
                })}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="timePerTurn">Temps par tour (secondes)</Label>
              <Input
                id="timePerTurn"
                type="number"
                min="10"
                max="300"
                value={settings.timePerTurn}
                onChange={(e) => setSettings({
                  ...settings,
                  timePerTurn: parseInt(e.target.value) || 30
                })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="numberOfRounds">Nombre de questions</Label>
              <Input
                id="numberOfRounds"
                type="number"
                min="1"
                max="50"
                value={settings.numberOfRounds}
                onChange={(e) => setSettings({
                  ...settings,
                  numberOfRounds: parseInt(e.target.value) || 10
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="anonymousVoting">Vote anonyme</Label>
              <Switch
                id="anonymousVoting"
                checked={settings.anonymousVoting}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  anonymousVoting: checked
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowJoinAfterStart">Rejoindre après le début</Label>
              <Switch
                id="allowJoinAfterStart"
                checked={settings.allowJoinAfterStart}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  allowJoinAfterStart: checked
                })}
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="antiCheatEnabled">Protection anti-triche</Label>
              <Switch
                id="antiCheatEnabled"
                checked={settings.antiCheatEnabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  antiCheatEnabled: checked
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="passwordProtected">Protégé par mot de passe</Label>
              <Switch
                id="passwordProtected"
                checked={settings.passwordProtected}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  passwordProtected: checked
                })}
              />
            </div>

            {settings.passwordProtected && (
              <div className="space-y-3">
                <Label htmlFor="partyPassword">Mot de passe de la partie</Label>
                <Input
                  id="partyPassword"
                  type="password"
                  value={settings.partyPassword}
                  onChange={(e) => setSettings({
                    ...settings,
                    partyPassword: e.target.value
                  })}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleCreateParty} disabled={loading} className="w-full">
          {loading ? 'Création...' : 'Créer la partie'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PartyCreationDialog;
