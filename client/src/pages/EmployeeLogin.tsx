import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { AlertCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function EmployeeLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.employee.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter email and password");
        setIsLoading(false);
        return;
      }

      const result = await loginMutation.mutateAsync({
        email,
        password,
      });

      if (result) {
        // Store employee info in localStorage for quick access
        localStorage.setItem("employeeSession", JSON.stringify({
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          employeeId: result.employeeId,
          loginTime: new Date().toISOString(),
        }));

        toast.success("Login successful!");
        setLocation("/employee/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xl text-gray-900">Solupedia</span>
              <span className="text-xs text-blue-600 font-semibold">Employee Portal</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Time Tracking Login</CardTitle>
            <CardDescription>
              Sign in with your employee credentials to access your time tracking dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@solupedia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={18} />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center">
                Need help? <a href="mailto:support@solupedia.com" className="text-blue-600 hover:underline">Contact Support</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to website */}
        <div className="text-center mt-6">
          <Link href="/">
            <a className="text-sm text-gray-600 hover:text-gray-900">← Back to Solupedia</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
