import { HardDrive } from "lucide-react";
import CategoryPage from "@/components/CategoryPage";

const Armazenamento = () => {
  return (
    <CategoryPage
      categoryId="armazenamento"
      title="Armazenamento"
      subtitle="HDs, SSDs, pendrives, cartões de memória e NAS"
      icon={HardDrive}
      heroGradient="from-amber-500/10 via-orange-500/5 to-amber-500/10"
    />
  );
};

export default Armazenamento;
