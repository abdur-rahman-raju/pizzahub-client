"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Pizza } from "lucide-react";

export default function ImageGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState({});

  const markFailed = (index) =>
    setFailed((prev) => ({ ...prev, [index]: true }));

  const current = images[selected];

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
        {current && !failed[selected] ? (
          <img
            src={current}
            alt={name}
            onError={() => markFailed(selected)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Pizza className="h-16 w-16" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              className={`aspect-square overflow-hidden rounded-lg border-2 bg-muted transition ${
                index === selected
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {failed[index] ? (
                <span className="flex h-full w-full items-center justify-center">
                  <Pizza className="h-5 w-5 text-muted-foreground" />
                </span>
              ) : (
                <img
                  src={src}
                  alt={`${name} ${index + 1}`}
                  onError={() => markFailed(index)}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}