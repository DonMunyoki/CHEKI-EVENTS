import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="sm" showText={true} />
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {userName && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-sky-50 rounded-full border border-gray-200">
                <User className="h-4 w-4 text-sky-600" />
                <span className="text-sm">{userName}</span>
              </div>
            )}

            {onLogout && (
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
