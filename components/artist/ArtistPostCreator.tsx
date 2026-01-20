"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, X, Sun, Contrast, Wand2, ZoomIn } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"

interface ArtistPost {
  post_uuid: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export function ArtistPostCreator() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<"idle" | "editing" | "caption">("idle")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Image editing state
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [blur, setBlur] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [caption, setCaption] = useState("")

  // Subscribe to file input changes from profile component
  useEffect(() => {
    const handleFileSelect = (event: any) => {
      const file = event.detail?.file
      console.log("DEBUG ArtistPostCreator: post-file-selected event received", !!file, event.detail)
      if (file) {
        handleImageSelected(file)
      }
    }

    window.addEventListener("post-file-selected", handleFileSelect)

    // if a file was already selected before this component mounted, consume it
    const pending = (window as any).__pendingPostFile as File | undefined | null
    if (pending) {
      console.log("DEBUG ArtistPostCreator: found pending file on mount", pending)
      handleImageSelected(pending)
      ;(window as any).__pendingPostFile = null
    }

    return () => window.removeEventListener("post-file-selected", handleFileSelect)
  }, [])

  // Listen for direct open requests from Create Post buttons
  useEffect(() => {
    const handler = (ev: Event) => {
      // If a pending file already exists, it will be consumed by the post-file-selected handler
      const pending = (window as any).__pendingPostFile as File | null | undefined
      if (pending) {
        console.log("DEBUG ArtistPostCreator: handler saw pending file, nothing to click")
        return
      }

      // Only programmatically open the file chooser when the event is a trusted user activation
      // to avoid browser warnings: "File chooser dialog can only be shown with a user activation.".
      try {
        if ((ev && (ev as Event).isTrusted) && fileInputRef.current) {
          fileInputRef.current.click()
          console.log("DEBUG ArtistPostCreator: open-post-creator triggered by user, clicked local input")
          return
        }
      } catch (e) {
        // ignore
      }

      console.warn("DEBUG: ArtistPostCreator: will not open file picker without user activation")
    }

    // Support both event names used across the app
    window.addEventListener("open-post-creator", handler)
    window.addEventListener("request-post-file", handler)
    return () => {
      window.removeEventListener("open-post-creator", handler)
      window.removeEventListener("request-post-file", handler)
    }
  }, [])

  // Handle file selection
  const handleImageSelected = (file: File) => {
    console.log("DEBUG ArtistPostCreator: handleImageSelected called", file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string)
      setStep("editing")
      console.log("DEBUG ArtistPostCreator: selectedImage set, entering editing step")
      // Reset filters
      setBrightness(100)
      setContrast(100)
      setBlur(0)
      setZoom(1)
      setCaption("")
    }
    reader.readAsDataURL(file)
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (!user || !selectedImage || !caption.trim()) return

    setLoading(true)
    try {
      // Create canvas with filters applied
      const canvas = document.createElement("canvas")
      const img = new (window as any).Image()
      img.crossOrigin = "anonymous"
      
      img.onload = async () => {
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setLoading(false)
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // Apply filters using canvas
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`
        ctx.drawImage(img, 0, 0)
        // create a data URL snapshot of the filtered image for immediate client display
        const dataUrl = canvas.toDataURL("image/png")

        canvas.toBlob(async (blob) => {
          if (!blob) {
            setLoading(false)
            return
          }

          // Upload to storage
          const fileName = `posts/${user.id}/${Date.now()}.png`
          let uploadedPath: string | null = null
          try {
            const { error: uploadError } = await supabase.storage
              .from("posts")
              .upload(fileName, blob)

            if (!uploadError) {
              uploadedPath = fileName
            } else {
              console.warn("Upload error, will fallback to data URL:", uploadError)
            }
          } catch (err) {
            console.warn("Storage upload threw, falling back to data URL:", err)
          }

          // Prepare final image value: prefer uploaded storage path, otherwise dataUrl
          const finalImage = uploadedPath ? uploadedPath : dataUrl

          // Call server API to create post (service role ensures DB insert)
          try {
            const res = await fetch("/api/posts/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({
                user_id: user.id,
                caption,
                image_url: finalImage,
                filters: { brightness, contrast, blur, zoom },
              }),
            })

            // Read raw response for better debugging (some errors return non-JSON)
            const text = await res.text()
            let json: any = null
            try {
              json = text ? JSON.parse(text) : null
            } catch (e) {
              json = text
            }

            if (res.ok && json?.success) {
              // On success, create client-side post for immediate display
              const post_uuid = json.post?.post_uuid || json.post_uuid || `local-${Date.now()}`;
              const clientPost = {
                post_uuid,
                user_id: user.id,
                image_url: finalImage,
                caption,
                created_at: json.post?.created_at ?? new Date().toISOString(),
              }
              try {
                const list = JSON.parse(localStorage.getItem("local_posts") || "[]")
                list.unshift(clientPost)
                localStorage.setItem("local_posts", JSON.stringify(list))
              } catch (e) {
                console.warn("Could not write local_posts", e)
              }
              // Emit events for immediate UI update
              window.dispatchEvent(new CustomEvent("client-post-created", { detail: clientPost }))
              window.dispatchEvent(new CustomEvent("posts-updated"))

              window.dispatchEvent(new CustomEvent("client-post-created", { detail: clientPost }))
              window.dispatchEvent(new Event("posts-updated"))
              // Clear pending file and close the editor immediately to avoid re-opening
              try {
                ;(window as any).__pendingPostFile = null
              } catch (e) {}
              setSelectedImage(null)
              setCaption("")
              setStep("idle")
            } else {
              console.error("Server post-create failed: status=", res.status, "body=", json)
            }
          } catch (err) {
            console.error("Failed to call post-create API:", err)
          }

          setLoading(false)
        }, "image/png")
      }
      img.src = selectedImage
    } catch (error) {
      console.error("Error creating post:", error)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Local hidden input so ArtistPostCreator can accept files when opened directly */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          console.log("DEBUG ArtistPostCreator: local file input change", !!file)
          if (file) handleImageSelected(file)
        }}
        className="hidden"
        aria-hidden
      />
      {/* Dev-only visible confirmation when a file is selected */}
      {process.env.NODE_ENV === "development" && selectedImage && (
        <div className="fixed bottom-4 right-4 z-60 p-2 bg-green-600 text-white rounded">Image loaded</div>
      )}
      {/* Image Editing Modal */}
      {step === "editing" && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Photo</h2>
              <button
                onClick={() => {
                  setStep("idle")
                  setSelectedImage(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Image Preview with Filters */}
            <div className="mb-6 flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                  transform: `scale(${zoom})`,
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Filter Controls */}
            <div className="space-y-4 mb-6">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Sun className="h-4 w-4" />
                    Brightness
                  </label>
                  <span className="text-sm text-muted-foreground">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Contrast className="h-4 w-4" />
                    Contrast
                  </label>
                  <span className="text-sm text-muted-foreground">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Wand2 className="h-4 w-4" />
                    Blur
                  </label>
                  <span className="text-sm text-muted-foreground">{blur}px</span>
                </div>
                <Slider
                  value={[blur]}
                  onValueChange={(value) => setBlur(value[0])}
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>

              {/* Zoom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <ZoomIn className="h-4 w-4" />
                    Zoom
                  </label>
                  <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("idle")
                  setSelectedImage(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setStep("caption")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Caption Step */}
      {step === "caption" && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Caption</h2>
              <button
                onClick={() => {
                  setStep("idle")
                  setSelectedImage(null)
                  setCaption("")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Caption Input */}
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-24"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setStep("editing")}
              >
                Back
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={loading || !caption.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
