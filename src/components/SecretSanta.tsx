import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Users, Shuffle, Eye, EyeOff, Trash2, Sparkles } from 'lucide-react';

type AgeGroup = 'Adult' | 'Kid';

interface Participant {
  id: string;
  name: string;
  ageGroup: AgeGroup;
}

interface Pairing {
  giver: string;
  receiver: string;
}

const SecretSanta = () => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('Adult');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const [screen, setScreen] = useState<'setup' | 'reveal'>('setup');

  const adults = participants.filter(p => p.ageGroup === 'Adult');
  const kids = participants.filter(p => p.ageGroup === 'Kid');

  const addParticipant = () => {
    if (name.trim()) {
      setParticipants([
        ...participants,
        { id: Date.now().toString(), name: name.trim(), ageGroup }
      ]);
      setName('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  // Circular pairing algorithm
  const generateCircularPairings = (group: Participant[]): Pairing[] => {
    if (group.length < 2) return [];
    
    // Shuffle the group
    const shuffled = [...group].sort(() => Math.random() - 0.5);
    
    // Create circular pairings
    const pairs: Pairing[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const nextIndex = (i + 1) % shuffled.length;
      pairs.push({
        giver: shuffled[i].name,
        receiver: shuffled[nextIndex].name
      });
    }
    
    return pairs;
  };

  const generatePairings = () => {
    const adultPairings = generateCircularPairings(adults);
    const kidPairings = generateCircularPairings(kids);
    
    setPairings([...adultPairings, ...kidPairings]);
    setScreen('reveal');
  };

  const revealMatch = (giverName: string) => {
    setRevealedFor(giverName);
  };

  const hideMatch = () => {
    setRevealedFor(null);
  };

  const startOver = () => {
    setParticipants([]);
    setPairings([]);
    setRevealedFor(null);
    setScreen('setup');
  };

  const canGenerate = adults.length >= 2 || kids.length >= 2;

  const getReceiverForGiver = (giverName: string): string | undefined => {
    return pairings.find(p => p.giver === giverName)?.receiver;
  };

  if (screen === 'reveal') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Secret Santa Reveal</h1>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg">
              Pass the device around. Each person should click their name to see their match privately.
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Click Your Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {participants.map(participant => (
                <div key={participant.id}>
                  {revealedFor === participant.name ? (
                    <Card className="bg-primary/10 border-primary">
                      <CardContent className="p-6 space-y-4">
                        <p className="text-center text-lg text-muted-foreground">
                          {participant.name}, you're giving a gift to:
                        </p>
                        <p className="text-center text-3xl font-bold text-primary">
                          {getReceiverForGiver(participant.name)}
                        </p>
                        <Button
                          onClick={hideMatch}
                          className="w-full"
                          variant="outline"
                        >
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide (Pass to Next Person)
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button
                      onClick={() => revealMatch(participant.name)}
                      className="w-full justify-between"
                      variant="secondary"
                    >
                      <span>{participant.name}</span>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={startOver} variant="outline" className="w-full">
            <Shuffle className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-10 h-10 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Secret Santa Generator</h1>
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Create magical gift exchanges with complete privacy
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                className="flex-1"
              />
              <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Kid">Kid</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addParticipant} disabled={!name.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Adults
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {adults.length} {adults.length === 1 ? 'person' : 'people'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No adults added yet</p>
              ) : (
                <ul className="space-y-2">
                  {adults.map(adult => (
                    <li
                      key={adult.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <span className="font-medium">{adult.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(adult.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Kids
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {kids.length} {kids.length === 1 ? 'kid' : 'kids'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kids.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No kids added yet</p>
              ) : (
                <ul className="space-y-2">
                  {kids.map(kid => (
                    <li
                      key={kid.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <span className="font-medium">{kid.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(kid.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <Button
              onClick={generatePairings}
              disabled={!canGenerate}
              className="w-full"
              size="lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Generate Secret Santa Pairings
            </Button>
            {!canGenerate && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                Add at least 2 people in one group to generate pairings
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretSanta;
