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
import { AlertCircle, Clock, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

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
        localStorage.setItem(
          "employeeSession",
          JSON.stringify({
            id: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            employeeId: result.employeeId,
            loginTime: new Date().toISOString(),
          })
        );

        toast.success("Login successful!");
        setTimeout(() => {
          setLocation("/employee/dashboard");
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl mb-6 transform -rotate-3"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-3xl text-gray-900 mb-2">Solupedia</h1>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Employee Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-white/20 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100/50 pb-8 pt-8">
            <CardTitle className="text-2xl text-center text-blue-900">
              Time Tracking Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@solupedia.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                />
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
                    <>
                      <LogIn className="mr-2" size={20} />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Need help?{" "}
                <a
                  href="mailto:support@solupedia.com"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
                >
                  Contact Support
                </a>
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Solupedia
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2026 Solupedia LTD. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Import ArrowLeft icon since we used it
import { ArrowLeft } from "lucide-react";
