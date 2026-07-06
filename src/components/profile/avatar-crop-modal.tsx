"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const OUTPUT_SIZE = 512; // final avatar resolution
const VIEWPORT = 280; // crop circle size on screen

export function AvatarCropModal({
  file,
  onCancel,
  onCropped,
}: {
  file: File;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleImgLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  // minimum zoom so the shorter side always covers the viewport
  const baseScale =
    naturalSize.w && naturalSize.h
      ? VIEWPORT / Math.min(naturalSize.w, naturalSize.h)
      : 1;

  function clampOffset(x: number, y: number, currentZoom: number) {
    const scale = baseScale * currentZoom;
    const displayW = naturalSize.w * scale;
    const displayH = naturalSize.h * scale;
    const maxX = Math.max(0, (displayW - VIEWPORT) / 2);
    const maxY = Math.max(0, (displayH - VIEWPORT) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = clampOffset(dragState.current.origX + dx, dragState.current.origY + dy, zoom);
    setOffset(next);
  }

  function onPointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(next: number) {
    setZoom(next);
    setOffset((prev) => clampOffset(prev.x, prev.y, next));
  }

  const doCrop = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const scale = baseScale * zoom;

    // Position of the viewport's top-left corner within the *displayed* image,
    // then convert back to natural-pixel coordinates.
    const displayW = naturalSize.w * scale;
    const displayH = naturalSize.h * scale;
    const viewLeft = (displayW - VIEWPORT) / 2 - offset.x;
    const viewTop = (displayH - VIEWPORT) / 2 - offset.y;

    const sx = viewLeft / scale;
    const sy = viewTop / scale;
    const sSize = VIEWPORT / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        if (blob) onCropped(blob);
      },
      "image/jpeg",
      0.9
    );
  }, [baseScale, zoom, offset, naturalSize, onCropped]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-paper rounded-lg p-4 w-full max-w-sm">
        <h3 className="text-sm font-medium mb-3">Adjust your avatar</h3>

        <div
          className="relative mx-auto overflow-hidden rounded-full bg-black/20 touch-none select-none"
          style={{ width: VIEWPORT, height: VIEWPORT, cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {imgUrl && (
            <img
              ref={imgRef}
              src={imgUrl}
              onLoad={handleImgLoad}
              alt="Crop preview"
              draggable={false}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: naturalSize.w * baseScale * zoom,
                height: naturalSize.h * baseScale * zoom,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                maxWidth: "none",
              }}
            />
          )}
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full mt-4"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm rounded border">
            Cancel
          </button>
          <button
            type="button"
            onClick={doCrop}
            className="px-3 py-1.5 text-sm rounded bg-black text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}