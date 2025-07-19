import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, User, Building2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-foreground">JobHunt</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Search jobs
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Browse salaries
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Find recruiters
            </a>
          </nav>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Country selector */}
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Globe className="w-4 h-4" />
            <span>Australia</span>
          </Button>
          
          {/* Auth buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
                <span>Log in</span>
              </Button>
            </Link>
          )}
          
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Building2 className="w-4 h-4" />
            <span>Go to Employer site</span>
          </Button>
        </div>
      </div>
    </header>
  );
}