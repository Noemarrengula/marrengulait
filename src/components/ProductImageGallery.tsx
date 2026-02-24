import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative overflow-hidden group">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <img
            src={images[currentIndex]}
            alt={`${productName} - ${currentIndex + 1}`}
            className="w-full h-full object-contain p-8"
          />
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* 360 Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-full">
          Vista 360°
        </div>
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
