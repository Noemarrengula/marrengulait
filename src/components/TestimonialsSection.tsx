import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  product?: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "João Mutambo",
    location: "Maputo",
    rating: 5,
    comment: "Excelente serviço! A entrega foi super rápida, chegou em 2 dias para a Matola. Recomendo a todos!",
    product: "Câmera Hikvision DS-2CE76D0T-ITMF"
  },
  {
    name: "Ana Cossa",
    location: "Beira",
    rating: 5,
    comment: "Comprei um laptop Dell e estou muito satisfeita. O preço foi o melhor que encontrei em Moçambique.",
    product: "Dell Latitude 5520"
  },
  {
    name: "Carlos Zunguza",
    location: "Nampula",
    rating: 4,
    comment: "Bom atendimento ao cliente. Tive uma dúvida sobre o produto e responderam rapidamente pelo WhatsApp.",
    product: "Monitor Samsung 24\""
  },
  {
    name: "Maria Matsinhe",
    location: "Maputo",
    rating: 5,
    comment: "Já é a terceira vez que compro aqui. Qualidade garantida e sempre com excelente embalagem.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de clientes satisfeitos em Moçambique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="hover:shadow-lg transition-shadow bg-white"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-[#FF3131]/20 mb-4" />
                
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                  "{testimonial.comment}"
                </p>

                {testimonial.product && (
                  <p className="text-xs text-[#FF3131] mb-3">
                    📦 {testimonial.product}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-3 border-t">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3131] to-[#FF5555] flex items-center justify-center text-white font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-white px-8 py-4 rounded-full shadow-md">
            <div>
              <p className="text-2xl font-bold text-[#FF3131]">2,500+</p>
              <p className="text-xs text-muted-foreground">Clientes</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-[#FF3131]">4.8/5</p>
              <p className="text-xs text-muted-foreground">Avaliação Média</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-[#FF3131]">98%</p>
              <p className="text-xs text-muted-foreground">Satisfação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
