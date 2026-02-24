import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Rocket, Users, Award, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal();
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal();

  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Democratizar o acesso à tecnologia em Moçambique, oferecendo produtos de qualidade e serviços especializados."
    },
    {
      icon: Rocket,
      title: "Visão",
      description: "Ser a plataforma líder de e-commerce de tecnologia em Moçambique, reconhecida pela excelência e inovação."
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Integridade, inovação, compromisso com o cliente e desenvolvimento da comunidade tecnológica."
    }
  ];

  const milestones = [
    { year: "2020", title: "Fundação", description: "Início da jornada com uma visão clara" },
    { year: "2021", title: "Primeiro Marketplace", description: "Lançamento da plataforma online" },
    { year: "2022", title: "Expansão", description: "Mais de 50 vendedores parceiros" },
    { year: "2024", title: "Hoje", description: "Líder em e-commerce de tecnologia" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div ref={heroRef} className={`max-w-4xl mx-auto text-center scroll-reveal ${heroVisible ? 'is-visible' : ''}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre a <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Marrengula-IT</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Conectando Moçambique ao futuro digital através da tecnologia e inovação
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div ref={storyRef} className={`max-w-4xl mx-auto scroll-reveal ${storyVisible ? 'is-visible' : ''}`}>
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa História</h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                A <strong className="text-foreground">Marrengula-IT</strong> nasceu de uma paixão: tornar a tecnologia acessível 
                a todos os moçambicanos. Fundada por profissionais experientes em TI, nossa jornada começou com 
                uma simples pergunta: "Como podemos facilitar o acesso a produtos e serviços de tecnologia de qualidade?"
              </p>

              <p>
                Com anos de experiência em desenvolvimento de software, infraestrutura de redes e consultoria em TI, 
                percebemos que havia uma lacuna no mercado moçambicano. As pessoas precisavam de uma plataforma 
                confiável onde pudessem encontrar produtos tecnológicos autênticos, com garantia e suporte especializado.
              </p>

              <p>
                Assim nasceu a <strong className="text-foreground">Marrengula-IT</strong> - mais do que um e-commerce, 
                um ecossistema completo que une marketplace, serviços profissionais de TI e uma comunidade de 
                entusiastas da tecnologia.
              </p>

              <p>
                Hoje, orgulhamo-nos de ser parceiros de confiança de dezenas de vendedores e milhares de clientes, 
                contribuindo para a transformação digital de Moçambique, um produto e serviço de cada vez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div ref={valuesRef} className={`scroll-reveal ${valuesVisible ? 'is-visible' : ''}`}>
            <h2 className="text-3xl font-bold mb-12 text-center">Nossos Pilares</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <Card 
                  key={value.title}
                  className="p-8 text-center hover:shadow-xl hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nossa Jornada</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-accent" />
              
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.year}
                  className={`relative mb-12 ${index % 2 === 0 ? 'text-right pr-1/2' : 'text-left pl-1/2'}`}
                >
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <Card className={`p-6 max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'} hover:shadow-lg transition-all`}>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-bold text-primary">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div ref={teamRef} className={`max-w-4xl mx-auto text-center scroll-reveal ${teamVisible ? 'is-visible' : ''}`}>
            <h2 className="text-3xl font-bold mb-6">Nossa Equipa</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Somos uma equipa apaixonada por tecnologia, composta por desenvolvedores, engenheiros de redes, 
              designers e especialistas em e-commerce, todos dedicados a oferecer a melhor experiência aos nossos clientes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6">
                <Code className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Desenvolvimento</h3>
                <p className="text-sm text-muted-foreground">Especialistas em criar soluções inovadoras</p>
              </Card>
              <Card className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Suporte</h3>
                <p className="text-sm text-muted-foreground">Sempre prontos para ajudar</p>
              </Card>
              <Card className="p-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">Compromisso com a excelência</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Junte-se a Nós</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Faça parte da transformação digital de Moçambique. Explore nossos produtos ou 
              torne-se um parceiro vendedor.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/produtos')}>
                Explorar Produtos
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/servicos')}>
                Nossos Serviços
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
