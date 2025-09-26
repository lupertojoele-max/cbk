'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePWA } from '@/hooks/use-pwa'
import { X, Download, Smartphone, RefreshCw } from 'lucide-react'

export function InstallPrompt() {
  const {
    isSupported,
    canInstall,
    isInstalled,
    swUpdateAvailable,
    installApp,
    updateApp,
    getInstallInstructions
  } = usePWA()

  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  // Check if user has previously dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('cbk-pwa-install-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await installApp()
      if (!success) {
        setShowInstructions(true)
      }
    } catch (error) {
      console.error('Install failed:', error)
      setShowInstructions(true)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('cbk-pwa-install-dismissed', 'true')
  }

  const handleUpdate = async () => {
    await updateApp()
  }

  // Don't show if not supported, already installed, or dismissed
  if (!isSupported || isInstalled || isDismissed) {
    // Still show update prompt if available
    return swUpdateAvailable ? (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-racing-gray-800 border border-racing-gray-200 dark:border-racing-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-[#1877F2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-racing-gray-900 dark:text-white">
                Update Available
              </h3>
              <p className="text-xs text-racing-gray-600 dark:text-racing-gray-400">
                A new version of CBK Racing is available
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleUpdate}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-xs px-3 py-1 h-8"
            >
              Update
            </Button>
          </div>
        </div>
      </motion.div>
    ) : null
  }

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-racing-gray-800 border border-racing-gray-200 dark:border-racing-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-racing-gray-400 hover:text-racing-gray-600 dark:text-racing-gray-500 dark:hover:text-racing-gray-300"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-1">
                <Smartphone className="w-6 h-6 text-[#1877F2]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-racing-gray-900 dark:text-white">
                    Install CBK Racing
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    PWA
                  </Badge>
                </div>
                <p className="text-xs text-racing-gray-600 dark:text-racing-gray-400 mb-2">
                  Get the full app experience with offline access and quick launch
                </p>

                <div className="flex items-center gap-2 text-xs text-racing-gray-500 dark:text-racing-gray-400 mb-3">
                  <span>✓ Works offline</span>
                  <span>✓ Fast loading</span>
                  <span>✓ Home screen</span>
                </div>

                {showInstructions && (
                  <div className="mb-3 p-2 bg-racing-gray-50 dark:bg-racing-gray-700 rounded text-xs text-racing-gray-600 dark:text-racing-gray-400">
                    {getInstallInstructions()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-xs px-3 py-1 h-8 flex items-center gap-1"
                  >
                    {isInstalling ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        Install
                      </>
                    )}
                  </Button>

                  {!showInstructions && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowInstructions(true)}
                      className="text-xs px-2 py-1 h-8 text-racing-gray-600 dark:text-racing-gray-400"
                    >
                      How?
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}