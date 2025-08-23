import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Globe, Clock, Currency } from 'lucide-react';

const CompanySettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Settings</h1>
        <p className="text-muted-foreground">Configure your organization's global settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Basic company details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="Aql Technologies" />
            </div>
            <div>
              <Label htmlFor="company-id">Company ID</Label>
              <Input id="company-id" defaultValue="700123456789" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="Riyadh, Saudi Arabia" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Regional Settings
            </CardTitle>
            <CardDescription>Localization and regional preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Riyadh (GMT+3)" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="SAR - Saudi Riyal" />
            </div>
            <div>
              <Label htmlFor="language">Default Language</Label>
              <Input id="language" defaultValue="Arabic / English" />
            </div>
            <Button>Update Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>Define your organization's working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="work-start">Work Start Time</Label>
              <Input id="work-start" type="time" defaultValue="08:00" />
            </div>
            <div>
              <Label htmlFor="work-end">Work End Time</Label>
              <Input id="work-end" type="time" defaultValue="17:00" />
            </div>
            <div>
              <Label htmlFor="work-days">Working Days</Label>
              <Input id="work-days" defaultValue="Sunday - Thursday" />
            </div>
            <Button>Save Schedule</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Currency className="mr-2 h-5 w-5" />
              Financial Settings
            </CardTitle>
            <CardDescription>Configure financial and payroll settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
              <Input id="fiscal-year" defaultValue="January 1st" />
            </div>
            <div>
              <Label htmlFor="pay-frequency">Pay Frequency</Label>
              <Input id="pay-frequency" defaultValue="Monthly" />
            </div>
            <div>
              <Label htmlFor="vat-rate">VAT Rate (%)</Label>
              <Input id="vat-rate" defaultValue="15" />
            </div>
            <Button>Update Financial Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanySettings;