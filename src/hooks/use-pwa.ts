'use client'

import { useEffect, useState } from 'react'

interface PWAState {
  isSupported: boolean
  isInstalled: boolean
  isStandalone: boolean
  canInstall: boolean
  swRegistration: ServiceWorkerRegistration | null
  swUpdateAvailable: boolean
}

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    swRegistration: null,
    swUpdateAvailable: false,
  })

  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    // Check PWA support
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window

    // Check if app is running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    // Check if already installed (rough estimation)
    const isInstalled = isStandalone

    setPWAState(prev => ({
      ...prev,
      isSupported,
      isStandalone,
      isInstalled,
    }))

    if (!isSupported) {
      console.log('CBK Racing PWA: Not supported in this browser')
      return
    }

    // Register Service Worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })

        console.log('CBK Racing PWA: Service Worker registered successfully')

        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('CBK Racing PWA: Update found')
          const newWorker = registration.installing

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('CBK Racing PWA: Update available')
                setPWAState(prev => ({
                  ...prev,
                  swUpdateAvailable: true,
                }))
              }
            })
          }
        })

        setPWAState(prev => ({
          ...prev,
          swRegistration: registration,
        }))

      } catch (error) {
        console.error('CBK Racing PWA: Service Worker registration failed:', error)
      }
    }

    registerSW()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const installEvent = e as InstallPromptEvent
      setInstallPrompt(installEvent)
      setPWAState(prev => ({
        ...prev,
        canInstall: true,
      }))
      console.log('CBK Racing PWA: Install prompt available')
    }

    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('CBK Racing PWA: App installed successfully')
      setInstallPrompt(null)
      setPWAState(prev => ({
        ...prev,
        canInstall: false,
        isInstalled: true,
      }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async (): Promise<boolean> => {
    if (!installPrompt) {
      console.log('CBK Racing PWA: No install prompt available')
      return false
    }

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('CBK Racing PWA: User accepted install')
        setInstallPrompt(null)
        setPWAState(prev => ({
          ...prev,
          canInstall: false,
        }))
        return true
      } else {
        console.log('CBK Racing PWA: User dismissed install')
        return false
      }
    } catch (error) {
      console.error('CBK Racing PWA: Install failed:', error)
      return false
    }
  }

  const updateApp = async (): Promise<void> => {
    if (!pwaState.swRegistration) {
      console.log('CBK Racing PWA: No service worker registration')
      return
    }

    try {
      await pwaState.swRegistration.update()

      // Skip waiting to activate new version
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'VERSION') {
          console.log('CBK Racing PWA: Updated to version:', event.data.version)
          window.location.reload()
        }
      }

      if (pwaState.swRegistration.waiting) {
        pwaState.swRegistration.waiting.postMessage(
          { type: 'SKIP_WAITING' },
          [messageChannel.port2]
        )
      }
    } catch (error) {
      console.error('CBK Racing PWA: Update failed:', error)
    }
  }

  const getInstallInstructions = (): string => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return 'Tap the menu button (⋮) and select "Install app" or look for the install icon in the address bar.'
    } else if (userAgent.includes('firefox')) {
      return 'Tap the menu button and select "Install" or look for the install icon in the address bar.'
    } else if (userAgent.includes('safari')) {
      return 'Tap the share button and select "Add to Home Screen".'
    } else if (userAgent.includes('edg')) {
      return 'Tap the menu button (⋯) and select "Install app".'
    } else {
      return 'Look for an install option in your browser menu or address bar.'
    }
  }

  return {
    ...pwaState,
    installApp,
    updateApp,
    getInstallInstructions,
  }
}