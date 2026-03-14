import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("user_id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
    setSaving(false);
  };

  const initials = (displayName || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account details</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          {/* Avatar row */}
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarFallback className="gradient-primary text-lg font-bold text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-card-foreground">{displayName || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Display Name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email</Label>
              <Input value={user?.email || ""} disabled className="h-10 bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Member Since</Label>
              <Input value={profile ? new Date(profile.created_at).toLocaleDateString() : ""} disabled className="h-10 bg-muted/50" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 border-t border-border pt-6">
            <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground font-semibold">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={signOut} className="text-destructive hover:bg-destructive/5 hover:border-destructive/30">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
