import { Keyboard } from "lucide-react";
import CategoryPage from "@/components/CategoryPage";

const Perifericos = () => {
  return (
    <CategoryPage
      categoryId="perifericos"
      title="Periféricos"
      subtitle="Teclados, mouses, headsets, webcams e mais"
      icon={Keyboard}
      heroGradient="from-purple-500/10 via-pink-500/5 to-purple-500/10"
    />
  );
};

export default Perifericos;
