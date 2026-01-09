import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Server, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus("idle");
    
    try {
      const response = await fetch(`${apiUrl}/docs`, { method: "HEAD" });
      if (response.ok || response.status === 200) {
        setConnectionStatus("success");
        toast({ title: "Connected", description: "Successfully connected to the API" });
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      setConnectionStatus("error");
      toast({ 
        title: "Connection Failed", 
        description: "Could not connect to the API. Make sure the server is running.",
        variant: "destructive" 
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const saveApiUrl = () => {
    setApiBaseUrl(apiUrl);
    toast({ title: "Saved", description: "API URL has been updated" });
    testConnection();
  };

  return (
    <MainLayout title="Settings" subtitle="Configure your Smart City system">
      <div className="max-w-2xl space-y-6">
        {/* API Configuration */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Connect to your Smart City Management backend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API Base URL</Label>
              <div className="flex gap-2">
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1"
                />
                <Button onClick={testConnection} variant="outline" disabled={isConnecting}>
                  {isConnecting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the base URL of your FastAPI backend (e.g., http://localhost:8000)
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connectionStatus === "success" && (
                <>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-success">Connected successfully</span>
                </>
              )}
              {connectionStatus === "error" && (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-sm text-destructive">Connection failed</span>
                </>
              )}
            </div>

            <Button onClick={saveApiUrl} className="w-full">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Quick Setup Guide */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Quick Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Clone the backend repository</p>
                  <code className="mt-1 block rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
                    git clone https://github.com/GaganLonde/SMART-CITY-MANAGEMENT
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Install dependencies</p>
                  <code className="mt-1 block rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
                    pip install -r requirements.txt
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Start the server</p>
                  <code className="mt-1 block rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
                    uvicorn app.main:app --reload
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  4
                </div>
                <div>
                  <p className="font-medium text-foreground">Enter the API URL above and test the connection</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Default is http://localhost:8000
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">API Documentation</CardTitle>
            <CardDescription>
              Access the interactive API documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open(`${apiUrl}/docs`, '_blank')}
              >
                Swagger UI
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`${apiUrl}/redoc`, '_blank')}
              >
                ReDoc
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
