import { Wifi } from "lucide-react";
import CategoryPage from "@/components/CategoryPage";

const Redes = () => {
  return (
    <CategoryPage
      categoryId="redes"
      title="Redes & Conectividade"
      subtitle="Roteadores, access points, cabos e adaptadores"
      icon={Wifi}
      heroGradient="from-cyan-500/10 via-sky-500/5 to-cyan-500/10"
    />
  );
};

export default Redes;
