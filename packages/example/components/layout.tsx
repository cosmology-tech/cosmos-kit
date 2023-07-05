import { ThemeProvider } from "components/theme-provider";
import { ModeToggle } from "./mode-toggle";

interface RootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="bg-background text-foreground p-10 relative">
        <div className="absolute right-10 top-10">
          <ModeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
