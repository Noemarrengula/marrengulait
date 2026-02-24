import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFiltersCount: number;
}

const ProductFilters = ({ onFilterChange, activeFiltersCount }: ProductFiltersProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const categories = ["Laptops", "Hardware", "Acessórios", "Monitores", "Redes", "Smartphones"];
  const brands = ["HP", "Dell", "Lenovo", "Apple", "Samsung", "ASUS"];
  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    applyFilters({ categories: updated });
  };

  const handleBrandToggle = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    applyFilters({ brands: updated });
  };

  const handleRatingToggle = (rating: number) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    applyFilters({ ratings: updated });
  };

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);
    applyFilters({ priceRange: range });
  };

  const applyFilters = (updates: Partial<FilterOptions>) => {
    onFilterChange({
      categories: updates.categories ?? selectedCategories,
      priceRange: updates.priceRange ?? priceRange,
      brands: updates.brands ?? selectedBrands,
      ratings: updates.ratings ?? selectedRatings,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200000]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    onFilterChange({ categories: [], priceRange: [0, 200000], brands: [], ratings: [] });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtros
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categorias</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={category} className="cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Preço</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={200000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()} MT</span>
                <span>{priceRange[1].toLocaleString()} MT</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div>
            <h3 className="font-semibold mb-3">Marcas</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label htmlFor={brand} className="cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Ratings */}
          <div>
            <h3 className="font-semibold mb-3">Avaliação</h3>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => handleRatingToggle(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="cursor-pointer flex items-center gap-1">
                    {rating} ⭐ ou mais
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFilters;
