import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { useState } from "react";

const AdvancedFilters = ({ onClose }: { onClose?: () => void }) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const brands = ["Samsung", "Apple", "Xiaomi", "Asus", "Lenovo", "HP", "Dell"];
  const categories = ["Laptops", "Smartphones", "Componentes", "Periféricos"];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Filtros</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Faixa de Preço</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100000}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0].toLocaleString()} MT</span>
          <span>{priceRange[1].toLocaleString()} MT</span>
        </div>
      </div>

      {/* Brands */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Marcas</Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categorias</Label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox id={cat} />
              <Label htmlFor={cat} className="text-sm cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Avaliação</Label>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">& acima</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" className="flex-1">Limpar</Button>
        <Button className="flex-1">Aplicar</Button>
      </div>
    </Card>
  );
};

export default AdvancedFilters;
