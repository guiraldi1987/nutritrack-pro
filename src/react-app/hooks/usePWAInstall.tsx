import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for standalone display mode (installed PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check for mobile web app capable (iOS)
      const isIOSStandalone = (navigator as any).standalone;
      // Check if launched from home screen
      const isInstalled = isStandalone || isIOSStandalone;
      
      setIsInstalled(isInstalled);
      return isInstalled;
    };

    // Don't show install prompt if already installed
    if (checkIfInstalled()) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPromptEvent(promptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setCanInstall(false);
      setIsInstalled(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, we can show install instructions if not in standalone mode
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      // iOS doesn't support beforeinstallprompt, but we can show instructions
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (installPromptEvent) {
      try {
        await installPromptEvent.prompt();
        const choiceResult = await installPromptEvent.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        setInstallPromptEvent(null);
        setCanInstall(false);
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }
  };

  const dismissPrompt = () => {
    setCanInstall(false);
    // Store dismissal in localStorage to prevent showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user has recently dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      
      // Don't show prompt for a week after dismissal
      if (now - dismissedTime < oneWeek) {
        setCanInstall(false);
      }
    }
  }, []);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return {
    canInstall,
    isInstalled,
    isIOS,
    promptInstall,
    dismissPrompt,
    hasPromptEvent: !!installPromptEvent
  };
}
