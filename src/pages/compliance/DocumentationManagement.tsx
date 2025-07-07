import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Upload, Plus, Search } from "lucide-react";

const DocumentationManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentation Management</h1>
          <p className="text-muted-foreground">Centralized document repository and management system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Search className="h-4 w-4 mr-2" />Search</Button>
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload</Button>
          <Button className="bg-brand-primary text-white"><Plus className="h-4 w-4 mr-2" />New Folder</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Total Documents</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-primary">15,678</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Folder className="h-5 w-5" />Active Folders</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-success">247</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Storage Used</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-accent">2.3TB</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Access Requests</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-brand-warning">12</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>HR Policies</CardTitle><CardDescription>47 documents</CardDescription></CardHeader><CardContent><Badge className="bg-brand-success text-white">Current</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle>Employee Records</CardTitle><CardDescription>2,847 files</CardDescription></CardHeader><CardContent><Badge className="bg-brand-primary text-white">Secure</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle>Compliance Reports</CardTitle><CardDescription>156 reports</CardDescription></CardHeader><CardContent><Badge className="bg-brand-accent text-white">Updated</Badge></CardContent></Card>
      </div>
    </div>
  );
};

export default DocumentationManagement;