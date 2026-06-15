import { Zap } from "lucide-react";
import CategoryPage from "@/components/CategoryPage";

const Switches = () => {
  return (
    <CategoryPage
      categoryId="switches"
      title="Switches de Rede"
      subtitle="Switches gerenciáveis e não-gerenciáveis para sua rede"
      icon={Zap}
      heroGradient="from-blue-500/10 via-indigo-500/5 to-blue-500/10"
    />
  );
};

export default Switches;
