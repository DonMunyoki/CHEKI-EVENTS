import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Logo } from "./Logo";
import { Hash, LogIn, Sparkles, Lock } from "lucide-react";

interface LoginPageProps {
  onLogin: (admissionNumber: string, password: string) => Promise<void>;
  onSwitchToSignUp?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate admission number format (e.g., 24ZAD108991)
    const admissionPattern = /^\d{2}[A-Z]{3}\d{6}$/;
    if (!admissionPattern.test(admissionNumber)) {
      setError("Please enter a valid admission number (e.g., 24ZADXXXXXX)");
      setIsLoading(false);
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await onLogin(admissionNumber, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-sky-100 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <motion.p
            className="text-muted-foreground flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="h-4 w-4 text-sky-500" />
            Discover Nairobi's Hottest Events
            <Sparkles className="h-4 w-4 text-sky-500" />
          </motion.p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Student Login</CardTitle>
            <CardDescription className="text-center">
              Enter your Riara University credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admissionNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-sky-500" />
                  Admission Number
                </Label>
                <Input
                  id="admissionNumber"
                  type="text"
                  placeholder="Enter your admission number"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: YYCCCNNNNNN (e.g., 24ZAD108991)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-sky-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters long
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-black via-gray-800 to-sky-500 hover:opacity-90 transition-opacity shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Login to Cheki Events
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-sky-600 hover:text-sky-700 font-medium underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                For Riara University Students Only
              </p>
            </div>
          </CardContent>
        </Card>

        <motion.div
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© 2025 Cheki Events • Riara University</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
