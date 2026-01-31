import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-4 relative z-10"
      >
        <Card className="shadow-2xl border-white/20 bg-white/80 backdrop-blur-md">
          <CardContent className="pt-12 pb-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse blur-lg" />
                <div className="relative w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
              
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Page Not Found
              </h2>

              <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                Sorry, the page you are looking for doesn't exist.
                <br />
                It may have been moved or deleted.
              </p>

              <div
                id="not-found-button-group"
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleGoHome}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Return Home
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
