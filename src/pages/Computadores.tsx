import { Monitor } from "lucide-react";
import CategoryPage from "@/components/CategoryPage";

const Computadores = () => {
  return (
    <CategoryPage
      categoryId="computadores"
      title="Computadores"
      subtitle="Desktops, all-in-one, laptops e acessórios"
      icon={Monitor}
      heroGradient="from-green-500/10 via-emerald-500/5 to-green-500/10"
    />
  );
};

export default Computadores;
