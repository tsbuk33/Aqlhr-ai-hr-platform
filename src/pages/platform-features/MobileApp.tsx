import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Download, 
  MapPin, 
  Camera, 
  Wifi, 
  Shield,
  CheckCircle2,
  Clock,
  Users,
  BarChart3
} from "lucide-react";
import MobileAttendanceApp from "@/components/MobileAttendanceApp";

const MobileAppFeature = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AqlHR Mobile App
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Native mobile application for iOS, Android, and HarmonyOS with offline-first attendance tracking
        </p>
      </div>

      {/* Platform Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-center">iOS</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">iOS 14.0+</p>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                App Store Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-center">Android</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Android 7.0+</p>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Play Store Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-center">HarmonyOS</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">HarmonyOS 3.0+</p>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                AppGallery Ready
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">2,847</div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-brand-primary" />
                <span className="text-muted-foreground">Daily active users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">App Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-success">4.8/5</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand-success" />
                <span className="text-muted-foreground">User satisfaction</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Offline Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">31.2%</div>
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">Offline sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Sync Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">99.9%</div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-brand-warning" />
                <span className="text-muted-foreground">Data sync rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="technical">Technical Specs</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-primary" />
                  GPS Attendance Tracking
                </CardTitle>
                <CardDescription>Location-based check-in/out with geofencing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Automatic location detection</li>
                  <li>• Configurable geofence radius</li>
                  <li>• Multiple office location support</li>
                  <li>• High-accuracy GPS tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-brand-accent" />
                  Photo Verification
                </CardTitle>
                <CardDescription>Selfie capture for attendance verification</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Check-in/out photo capture</li>
                  <li>• Automatic image compression</li>
                  <li>• Secure cloud storage</li>
                  <li>• Face detection validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-brand-success" />
                  Offline-First Design
                </CardTitle>
                <CardDescription>Works seamlessly without internet connection</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Local data storage</li>
                  <li>• Automatic sync when online</li>
                  <li>• Conflict resolution</li>
                  <li>• Offline time tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-warning" />
                  Break Management
                </CardTitle>
                <CardDescription>Track breaks, lunch, and prayer times</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Multiple break types</li>
                  <li>• Automatic time calculation</li>
                  <li>• Break duration tracking</li>
                  <li>• Custom break categories</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Mobile App Demo</CardTitle>
              <CardDescription>Experience the mobile attendance app interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6">
                <MobileAttendanceApp />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Framework</span>
                    <Badge variant="outline">Capacitor</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Frontend</span>
                    <Badge variant="outline">React + TypeScript</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Backend</span>
                    <Badge variant="outline">Supabase Edge Functions</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Badge variant="outline">PostgreSQL</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <Badge variant="outline">Supabase Storage</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-success" />
                    <span className="text-sm">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-success" />
                    <span className="text-sm">JWT authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-success" />
                    <span className="text-sm">SSL/TLS encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-success" />
                    <span className="text-sm">Row-level security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-success" />
                    <span className="text-sm">Biometric authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Store Deployment</CardTitle>
              <CardDescription>Ready for distribution on all major app stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Apple App Store</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• iOS 14.0+ compatible</li>
                    <li>• App Store guidelines compliant</li>
                    <li>• Optimized for all iPhone sizes</li>
                    <li>• iPad support included</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Google Play Store</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Android 7.0+ compatible</li>
                    <li>• Material Design 3.0</li>
                    <li>• Adaptive icons support</li>
                    <li>• 64-bit architecture</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Huawei AppGallery</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• HarmonyOS 3.0+ support</li>
                    <li>• HMS Core integration</li>
                    <li>• No Google services dependency</li>
                    <li>• Huawei Mobile Services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Commands</CardTitle>
              <CardDescription>Build and deploy the mobile app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p># Initialize Capacitor project</p>
                  <p>npx cap init</p>
                  <br />
                  <p># Add mobile platforms</p>
                  <p>npx cap add ios</p>
                  <p>npx cap add android</p>
                  <br />
                  <p># Build and sync</p>
                  <p>npm run build</p>
                  <p>npx cap sync</p>
                  <br />
                  <p># Run on device/emulator</p>
                  <p>npx cap run ios</p>
                  <p>npx cap run android</p>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Download className="h-4 w-4 mr-2" />
                    Download iOS Build
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Android APK
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAppFeature;