import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Termos e Condições' }]} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Termos e Condições</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground">
              Bem-vindo à Marrengula-IT. Ao utilizar este website, concorda com os seguintes termos e condições. 
              Por favor, leia-os attentamente antes de utilizar os nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Identificação da Empresa</h2>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p><strong>Marrengula-IT</strong></p>
              <p>Email: marrengulait@gmail.com</p>
              <p>Telefone: +258 864738133</p>
              <p>Localização: Maputo, Moçambique</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Produtos e Preços</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Todos os preços são apresentados em Meticais (MT) e podem ser alterados sem aviso prévio.</li>
              <li>Os produtos estão sujeitos à disponibilidade em stock.</li>
              <li>As imagens dos produtos são meramente ilustrativas.</li>
              <li>Garantimos a autenticidade de todos os produtos vendidos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Processamento de Pedidos</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Os pedidos são confirmados após confirmação do pagamento.</li>
              <li>O prazo de entrega é de 2 a 5 dias úteis para Maputo e 5 a 10 dias para outras provinces.</li>
              <li>Os custos de envio são calculados durante o checkout.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Pagamentos</h2>
            <p className="text-muted-foreground">
              Aceitamos os seguintes métodos de pagamento:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>M-Pesa</li>
              <li>E-Mola</li>
              <li>Transferência Bancária</li>
              <li>Pagamento na Entrega (apenas em Maputo)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Devoluções e Reembolsos</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>O cliente tem até 7 dias para devolver um produto após receção.</li>
              <li>O produto deve estar em perfeito estado e na sua embalagem original.</li>
              <li>Os custos de devolução são da responsabilidade do cliente, exceto em caso de defeito.</li>
              <li>Reembolsos serão processados em até 14 dias após receção do produto devolvido.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Garantia</h2>
            <p className="text-muted-foreground">
              Todos os produtos têm garantia contra defeitos de fabrico. O período de garantia varia 
              conforme o fabricante, sendo geralmente de 12 meses. A garantia não cobre danos causados 
              por uso indevido, maus-tratos ou tentativa de reparação por terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Serviços de TI</h2>
            <p className="text-muted-foreground">
              Os serviços de TI prestados pela Marrengula-IT estão sujeitos a orçamento prévio. 
              O cliente deve aprovar o orçamento antes do início de qualquer trabalho. 
              Cancelamentos após início do trabalho podem estar sujeitos a custos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground">
              A Marrengula-IT não se responsabiliza por atrasos na entrega causados por terceiros, 
              problemas de conectividade, ou qualquer perda indireta. A nossa responsabilidade está 
              limitada ao valor total do pedido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Propriedade Intelectual</h2>
            <p className="text-muted-foreground">
              Todo o conteúdo deste website, incluindo textos, gráficos, logotipos e imagens, 
              é propriedade da Marrengula-IT e está protegido por leis de direitos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Modificações dos Termos</h2>
            <p className="text-muted-foreground">
              Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
              entrarão em vigor imediatamente após a sua publicação no website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Lei Aplicável</h2>
            <p className="text-muted-foreground">
              Estes termos são regidos pelas leis de Moçambique. Qualquer litígio será 
              resolvido nos tribunais competentes de Maputo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contacto</h2>
            <p className="text-muted-foreground">
              Para questões relacionadas com estes termos, contacte-nos através de:
            </p>
            <div className="bg-muted/30 p-4 rounded-lg mt-4">
              <p>Email: marrengulait@gmail.com</p>
              <p>Telefone: +258 864738133</p>
              <p>WhatsApp: +258 864738133</p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: {new Date().toLocaleDateString('pt-MZ')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
