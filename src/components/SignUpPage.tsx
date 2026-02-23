import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Logo } from "./Logo";
import { UserCircle, Hash, UserPlus, Sparkles, Lock, Mail } from "lucide-react";

interface SignUpPageProps {
  onSignUp: (admissionNumber: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function SignUpPage({ onSignUp, onSwitchToLogin }: SignUpPageProps) {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate admission number format (e.g., 24ZAD108991)
    const admissionPattern = /^\d{2}[A-Z]{3}\d{6}$/;
    if (!admissionPattern.test(admissionNumber)) {
      setError("Please enter a valid admission number (e.g., 24ZAD108991)");
      setIsLoading(false);
      return;
    }

    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await onSignUp(admissionNumber, email, password);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-sky-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mx-auto mb-4"
            >
              <Logo size="lg" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Join Cheki Events
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to discover amazing events
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admissionNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-sky-500" />
                  Admission Number
                </Label>
                <Input
                  id="admissionNumber"
                  type="text"
                  placeholder="e.g., 24ZAD108991"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: YYXXX123456 (e.g., 24ZAD108991)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-sky-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-sky-500" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2 focus:border-sky-500 h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-sky-600 hover:text-sky-700 font-medium underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
