import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Shield, Save } from "lucide-react";

const Settings = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordCurrent) {
      toast.error("Please enter your current password");
      return;
    }
    if (passwordNew.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordNew !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    // Verify current password first
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: passwordCurrent,
    });
    if (verifyErr) {
      setChangingPassword(false);
      toast.error("Current password is incorrect");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordNew });
    setChangingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      setPasswordCurrent("");
      setPasswordNew("");
      setPasswordConfirm("");
    }
  };

  if (authLoading) {
    return (
      <Layout>
      <SEO title="Account Settings" description="Manage your CyberHawk-UG account settings and profile information." path="/settings" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// ACCOUNT SETTINGS</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
            OPERATOR <span className="text-primary">PROFILE</span>
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-2xl space-y-8">
          {/* Profile Info */}
          <div className="border border-border bg-card p-6 space-y-5">
            <h2 className="font-display font-semibold text-sm tracking-widest uppercase text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Profile Information
            </h2>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground uppercase">Email</label>
              <div className="flex items-center gap-2 px-3 py-2 border border-border bg-secondary/30 text-sm text-muted-foreground font-mono">
                <Mail className="w-3.5 h-3.5" />
                {profile?.email}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground uppercase">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="font-mono text-sm bg-background border-border"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground uppercase">Role</label>
              <div className="flex items-center gap-2 px-3 py-2 border border-border bg-secondary/30 text-sm text-muted-foreground font-mono">
                <Shield className="w-3.5 h-3.5" />
                {profile?.role}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 font-display font-bold tracking-widest uppercase text-xs cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>

          {/* Change Password */}
          <div className="border border-border bg-card p-6 space-y-5">
            <h2 className="font-display font-semibold text-sm tracking-widest uppercase text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Change Password
            </h2>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground uppercase">New Password</label>
              <Input
                type="password"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="Min. 6 characters"
                className="font-mono text-sm bg-background border-border"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground uppercase">Confirm New Password</label>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="font-mono text-sm bg-background border-border"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="flex items-center gap-2 px-6 py-2 font-display font-bold tracking-widest uppercase text-xs cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50"
            >
              {changingPassword ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Settings;
