import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in and redirect to dashboard
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      setLocation("/admin/employees");
    }
  }, [setLocation]);

  const loginMutation = trpc.adminAuth.login.useMutation();

  // Demo credentials
  const fillDemoCredentials = () => {
    setEmail("admin@shoptonoutil.com");
    setPassword("admin123");
  };

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

      if (result.success) {
        // Store admin info in localStorage for quick access
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            id: result.admin.id,
            email: result.admin.email,
            loginTime: new Date().toISOString(),
          })
        );

        toast.success("Login successful!");
        // Small delay to ensure cookie is set
        setTimeout(() => {
          setLocation("/admin/services");
        }, 100);
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl mb-6 transform rotate-3"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            shoptonoutil Admin
          </h1>
          <p className="text-gray-600 text-lg">Portail de gestion</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-white/20 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100/50 pb-8 pt-8">
            <CardTitle className="text-2xl text-center text-blue-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2">
              Sign in to manage the platform content
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@shoptonoutil.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12 rounded-xl h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>

              {/* Demo Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Utiliser les identifiants de demo
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Email: admin@shoptonoutil.com | Mot de passe: admin123
                </p>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                  <Lock className="w-3 h-3 inline mr-1 mb-0.5" />
                  Secure Admin Portal
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2026 Solupedia LTD. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
