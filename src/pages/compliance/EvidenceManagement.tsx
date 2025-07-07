import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileText, Plus, Search } from "lucide-react";

const EvidenceManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground">Secure evidence collection and chain of custody tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Search className="h-4 w-4 mr-2" />Search</Button>
          <Button className="bg-brand-primary text-white"><Plus className="h-4 w-4 mr-2" />New Evidence</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Evidence Items</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-primary">234</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Sealed Cases</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-success">189</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Active Investigations</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-warning">3</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Chain Integrity</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-success">100%</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Digital Evidence</CardTitle><CardDescription>Emails, documents, digital records</CardDescription></CardHeader><CardContent><div className="space-y-2"><div className="flex justify-between"><span>Email Records</span><Badge className="bg-brand-success text-white">156</Badge></div><div className="flex justify-between"><span>Document Trails</span><Badge className="bg-brand-primary text-white">89</Badge></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle>Physical Evidence</CardTitle><CardDescription>Documents, contracts, signed papers</CardDescription></CardHeader><CardContent><div className="space-y-2"><div className="flex justify-between"><span>Signed Contracts</span><Badge className="bg-brand-success text-white">67</Badge></div><div className="flex justify-between"><span>Witness Statements</span><Badge className="bg-brand-accent text-white">23</Badge></div></div></CardContent></Card>
      </div>
    </div>
  );
};

export default EvidenceManagement;