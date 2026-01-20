"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

export interface CropData {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob, cropData: CropData) => void
  onCancel: () => void
  aspectRatio?: number
  circularity?: boolean
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  circularity = true,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Load image
  useEffect(() => {
    const img = new (window as any).Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setImage(img)
    img.src = imageSrc
  }, [imageSrc])

  // Draw preview
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, size, size)

    // Draw image
    const scaledWidth = image.width * zoom
    const scaledHeight = image.height * zoom
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight)

    // Draw circular overlay if circularity enabled
    if (circularity) {
      // Draw semi-transparent dark area outside circle
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      ctx.beginPath()
      ctx.rect(0, 0, size, size)
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2)
      ctx.fill("evenodd")

      // Draw circle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, [image, zoom, offsetX, offsetY, circularity])

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(5, prev + delta)))
  }

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffsetX(e.clientX - dragStart.x)
    setOffsetY(e.clientY - dragStart.y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle zoom slider
  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  // Reset
  const handleReset = () => {
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  // Crop and save
  const handleSave = () => {
    if (!image || !canvasRef.current) return

    const canvas = document.createElement("canvas")
    const size = 400
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw image
    const scaledWidth = image.width * zoom
    const scaledHeight = image.height * zoom
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight)

    // Apply circular clipping if enabled
    if (circularity) {
      const circleCanvas = document.createElement("canvas")
      circleCanvas.width = size
      circleCanvas.height = size
      const circleCtx = circleCanvas.getContext("2d")
      if (!circleCtx) return

      circleCtx.beginPath()
      circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      circleCtx.clip()

      circleCtx.drawImage(canvas, 0, 0)
      canvas.width = size
      canvas.height = size
      const mainCtx = canvas.getContext("2d")
      if (mainCtx) {
        mainCtx.drawImage(circleCanvas, 0, 0)
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob, {
          x: offsetX,
          y: offsetY,
          width: image.width * zoom,
          height: image.height * zoom,
        })
      }
    }, "image/png")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Crop Your Photo</h2>

        {/* Canvas Preview */}
        <div
          ref={containerRef}
          className="mb-6 bg-gray-100 rounded-lg overflow-hidden cursor-move"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* Zoom Control */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <ZoomOut className="w-4 h-4" />
            <Slider
              value={[zoom]}
              onValueChange={handleZoomChange}
              min={0.5}
              max={5}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4" />
            <span className="text-sm font-medium w-12">{zoom.toFixed(1)}x</span>
          </div>
          <p className="text-xs text-gray-500">
            Scroll or drag to pan • Use slider or scroll wheel to zoom
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save & Crop
          </Button>
        </div>
      </div>
    </div>
  )
}
