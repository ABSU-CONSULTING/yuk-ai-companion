import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  is_approved: boolean;
  created_at: string;
}

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin]);

  const toggleApproval = async (userId: string, approve: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: approve })
      .eq("user_id", userId);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(approve ? "User approved" : "User access revoked");
      fetchProfiles();
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div>
                  <p className="font-medium text-foreground">{p.display_name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">{p.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.is_approved ? "default" : "secondary"}>
                    {p.is_approved ? "Approved" : "Pending"}
                  </Badge>
                  {p.is_approved ? (
                    <Button size="sm" variant="outline" onClick={() => toggleApproval(p.user_id, false)}>
                      <X className="w-3 h-3 mr-1" /> Revoke
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => toggleApproval(p.user_id, true)}>
                      <Check className="w-3 h-3 mr-1" /> Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {profiles.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No users yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
