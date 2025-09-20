'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxImage {
  id: number
  url: string
  thumb?: string
  alt?: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  title?: string
  showThumbnails?: boolean
  showControls?: boolean
  allowDownload?: boolean
  allowShare?: boolean
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
  showThumbnails = true,
  showControls = true,
  allowDownload = false,
  allowShare = false,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false)
      setScale(1)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          handleResetZoom()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsZoomed(false)
    setScale(1)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsZoomed(false)
    setScale(1)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 3))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    const newScale = scale / 1.5
    if (newScale <= 1) {
      setScale(1)
      setIsZoomed(false)
    } else {
      setScale(newScale)
    }
  }

  const handleResetZoom = () => {
    setScale(1)
    setIsZoomed(false)
  }

  const handleDownload = async () => {
    const currentImage = images[currentIndex]
    try {
      const response = await fetch(currentImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `image-${currentImage.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleShare = async () => {
    const currentImage = images[currentIndex]
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'CBK Racing Image',
          text: currentImage.caption || currentImage.alt || 'Check out this image from CBK Racing',
          url: currentImage.url,
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(currentImage.url)
        // You could show a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                {title && (
                  <h2 className="text-lg font-semibold">{title}</h2>
                )}
                <Badge variant="outline" className="border-white text-white">
                  {currentIndex + 1} / {images.length}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {showControls && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomIn}
                      className="text-white hover:bg-white/20"
                      disabled={scale >= 3}
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomOut}
                      className="text-white hover:bg-white/20"
                      disabled={scale <= 1}
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>

                    {allowDownload && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    )}

                    {allowShare && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-white hover:bg-white/20"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 relative flex items-center justify-center p-4 pt-16 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-full"
                style={{
                  transform: `scale(${scale})`,
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onClick={() => isZoomed ? handleResetZoom() : handleZoomIn()}
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || `Image ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="object-contain max-w-full max-h-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-center max-w-3xl mx-auto">
                {currentImage.caption}
              </p>
            </div>
          )}

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex justify-center space-x-2 overflow-x-auto max-w-full">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                      index === currentIndex
                        ? 'border-racing-red scale-110'
                        : 'border-white/30 hover:border-white/60'
                    )}
                  >
                    <Image
                      src={image.thumb || image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="absolute bottom-4 left-4 text-white/60 text-xs hidden md:block">
            <div>← → Navigate • + - Zoom • ESC Close</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}