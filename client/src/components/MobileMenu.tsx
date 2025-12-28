import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden h-9 w-9"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-card border-l border-border shadow-lg">
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col gap-4 flex-1">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "text-base font-medium py-3 px-4 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "text-base font-medium py-3 px-4 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/crud#add"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "text-base font-medium py-3 px-4 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  Add Task
                </NavLink>
              </nav>
              
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-3"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-5 w-5" />
                      Switch to Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      Switch to Dark Mode
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}





