import { ExternalLink, Globe, Cpu, Sun, Building2, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const partners = [
  {
    id: 1,
    name: "Moz Electronic Hub",
    tagline: "Plataforma Open-Source",
    description: "Plataforma open-source para compartilhar projetos eletrônicos, colaborar com outros e transformar suas ideias em realidade em Moçambique e além.",
    url: "https://v0-eletro-hub.vercel.app/",
    icon: Cpu,
    previewGradient: "from-blue-600 via-blue-500 to-cyan-400",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-500",
    previewImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Smart Irriga",
    tagline: "Agricultura Inteligente",
    description: "Soluções de irrigação inteligente para uma agricultura sustentável em Moçambique. Optimize seus recursos hídricos com tecnologia.",
    url: "https://solar-grow-hub-wvqa.vercel.app/",
    icon: Sun,
    previewGradient: "from-green-600 via-emerald-500 to-teal-400",
    borderColor: "border-green-500/30",
    textColor: "text-green-500",
    previewImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Kynitas ERP",
    tagline: "Gestão Empresarial",
    description: "Sistema de gestão empresarial completo para otimizar os seus processos. Controle finanças, estoque, vendas e muito mais.",
    url: "https://kynitas-erp.vercel.app/dashboard",
    icon: Building2,
    previewGradient: "from-purple-600 via-violet-500 to-fuchsia-400",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-500",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#FF3131]" />
            <Badge variant="outline" className="border-[#FF3131]/30 text-[#FF3131]">
              Nossos Parceiros
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fazemos parte do ecossistema{' '}
            <span className="text-[#FF3131]">Marrengula</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore as nossas soluções parceiras que complementam a experiência Marrengula-IT
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {partners.map((partner) => {
            const IconComponent = partner.icon;
            return (
              <Card
                key={partner.id}
                className={`
                  relative overflow-hidden transition-all duration-300
                  hover:shadow-xl hover:-translate-y-2
                  border-2 ${partner.borderColor}
                  hover:border-opacity-60 group
                `}
              >
                <CardContent className="p-0">
                  {/* Preview Image - Real screenshot */}
                  <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* Real screenshot */}
                    <img 
                      src={partner.previewImage} 
                      alt={`${partner.name} preview`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Gradient overlay for text readability */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${partner.previewGradient} opacity-40`} />

                    {/* Browser frame simulation */}
                    <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-gray-700 px-3 py-1.5 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-600 rounded MX-auto mx-4 opacity-50" />
                      <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>

                    {/* Gradient line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${partner.previewGradient}`} />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Icon and title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${partner.previewGradient} bg-opacity-10`}>
                        <IconComponent className={`w-5 h-5 ${partner.textColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {partner.name}
                        </h3>
                        <p className={`text-xs font-medium ${partner.textColor}`}>
                          {partner.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {partner.description}
                    </p>

                    {/* CTA Button */}
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        inline-flex items-center justify-center gap-2 w-full
                        px-4 py-2.5 rounded-lg font-medium text-sm
                        bg-gradient-to-r ${partner.previewGradient}
                        text-white hover:opacity-90 transition-opacity
                        shadow-sm hover:shadow-md
                      `}
                    >
                      Visitar Plataforma
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <span className="text-sm text-muted-foreground">
              Juntos, construímos um ecossistema tecnológico moçambicano completo.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
