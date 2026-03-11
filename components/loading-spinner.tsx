export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animé */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
          <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        
        {/* Texte de chargement */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Chargement</span>
          <div className="flex gap-1">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-primary/20"></div>
          <div className="absolute top-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="text-muted-foreground">Chargement en cours...</p>
      </div>
    </div>
  );
}
