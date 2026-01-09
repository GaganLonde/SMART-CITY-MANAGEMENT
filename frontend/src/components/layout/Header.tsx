import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-lg">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="w-64 bg-secondary/50 pl-9 text-sm"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
          A
        </div>
      </div>
    </header>
  );
}
