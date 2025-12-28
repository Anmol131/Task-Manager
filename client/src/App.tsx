import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import StaticHome from './pages/StaticHome';
import Crud from './pages/Crud';
import TaskDetails from './pages/TaskDetails';
import { cn } from '@/lib/utils';
import { useTheme } from './components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { MobileMenu } from './components/MobileMenu';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-3 sm:py-4 md:py-5 mb-6 sm:mb-8 md:mb-10 border-b border-border px-3 sm:px-4 md:px-6">
        <div className="flex justify-start">
          <NavLink to="/" className="text-base sm:text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap">
            TaskManager
          </NavLink>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "text-sm md:text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Home
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => cn(
              "text-sm md:text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/crud#add" 
            className={({ isActive }) => cn(
              "text-sm md:text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Add Task
          </NavLink>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 lg:h-10 lg:w-10 ml-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 lg:h-5 lg:w-5" />
            ) : (
              <Moon className="h-4 w-4 lg:h-5 lg:w-5" />
            )}
          </Button>
        </div>
        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <MobileMenu />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<StaticHome />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/crud" element={<Crud />} />
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
