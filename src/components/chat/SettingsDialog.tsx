import { useState } from "react";
import { Settings, X, CheckCircle } from "lucide-react";

interface SettingsDialogProps {
  endpoint: string;
  onUpdateEndpoint: (url: string) => void;
}

export function SettingsDialog({ endpoint, onUpdateEndpoint }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(endpoint);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateEndpoint(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setValue(endpoint); }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground sidebar-item-hover"
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Ollama Endpoint</label>
            <p className="text-xs text-muted-foreground mb-2">
              Enter your VM's IP address or hostname where Ollama is running.
            </p>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="http://192.168.1.100:11434"
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-accent/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground text-sm">Setup instructions:</p>
            <p>1. On your VM, run: <code className="font-mono bg-background px-1 py-0.5 rounded">OLLAMA_HOST=0.0.0.0 ollama serve</code></p>
            <p>2. Set CORS: <code className="font-mono bg-background px-1 py-0.5 rounded">OLLAMA_ORIGINS=*</code></p>
            <p>3. Enter <code className="font-mono bg-background px-1 py-0.5 rounded">http://YOUR_VM_IP:11434</code> above</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : "Save Endpoint"}
          </button>
        </div>
      </div>
    </div>
  );
}
