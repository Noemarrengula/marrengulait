import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MegaMenu />
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Política de Privacidade' }]} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground">
              A Marrengula-IT compromete-se a proteger a sua privacidade. Esta política explica como 
              recolhemos, usamos e protegemos as suas informações pessoais quando utiliza o nosso website 
              e serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Responsável pelo Tratamento</h2>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p><strong>Marrengula-IT</strong></p>
              <p>Email: marrengulait@gmail.com</p>
              <p>Telefone: +258 864738133</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Dados Pessoais Recolhidos</h2>
            <p className="text-muted-foreground mb-4">
              Recolhemos os seguintes tipos de informações pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Dados de identificação:</strong> nome completo, email, número de telefone</li>
              <li><strong>Dados de morada:</strong> endereço de entrega e faturação</li>
              <li><strong>Dados de pagamento:</strong> informações de M-Pesa, E-Mola ou transferência bancária</li>
              <li><strong>Dados de navegação:</strong> IP, browser, páginas visitadas, tempo de permanência</li>
              <li><strong>Dados de preferências:</strong> produtos favoritos, histórico de compras</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Finalidades do Tratamento</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos os seus dados pessoais para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Processar e entregar encomendas</li>
              <li>Gerir a sua conta de cliente</li>
              <li>Enviar comunicações sobre pedidos e entregas</li>
              <li>Processar pagamentos e emitir faturas</li>
              <li>Fornecer suporte ao cliente</li>
              <li>Enviar newsletters e promoções (com seu consentimento)</li>
              <li>Melhorar os nossos serviços e website</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Base Legal</h2>
            <p className="text-muted-foreground">
              O tratamento dos seus dados pessoais baseia-se em:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li><strong>Execução de contrato:</strong> para processar pedidos e prestar serviços</li>
              <li><strong>Consentimento:</strong> para envio de marketing e newsletters</li>
              <li><strong>Interesse legítimo:</strong> para melhorar os nossos serviços</li>
              <li><strong>Obrigação legal:</strong> para cumprimento de obrigações fiscais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Partilha de Dados</h2>
            <p className="text-muted-foreground mb-4">
              Partilhamos os seus dados apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Fornecedores de serviços:</strong> empresas de entrega, processadores de pagamento</li>
              <li><strong>Supabase:</strong> nossa plataforma de base de dados (alojada na cloud)</li>
              <li><strong>Autoridades:</strong> quando exigido por lei (fiscal, judicial)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Não vendemos nem alugamos os seus dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Transferências Internacionais</h2>
            <p className="text-muted-foreground">
              Alguns dos nossos fornecedores estão localizados fora de Moçambique. Garantimos que 
              qualquer transferência internacional é feita em conformidade com as leis de proteção 
              de dados aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Dados de clientes:</strong> mantidos enquanto a conta estiver ativa + 5 anos</li>
              <li><strong>Dados de encomendas:</strong> mantidos por 10 anos para obrigações fiscais</li>
              <li><strong>Dados de marketing:</strong> mantidos até revogação do consentimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Os Seus Direitos</h2>
            <p className="text-muted-foreground mb-4">
              Tem os seguintes direitos sobre os seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados</li>
              <li><strong>Retificação:</strong> corrigir dados incorretos</li>
              <li><strong>Apagamento:</strong> solicitar a eliminação dos seus dados</li>
              <li><strong>Limitação:</strong> solicitar a limitação do tratamento</li>
              <li><strong>Portabilidade:</strong> receber os seus dados em formato estruturado</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento para marketing</li>
              <li><strong>Revogação:</strong> retirar consentimento a qualquer momento</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Para exercer os seus direitos, contacte-nos através de marrengulait@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Segurança dos Dados</h2>
            <p className="text-muted-foreground">
              Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Encriptação SSL/TLS para todas as comunicações</li>
              <li>Autenticação e controlo de acesso rigorosos</li>
              <li>Backups regulares e seguros</li>
              <li>Monitorização de acessos e atividades suspeitas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies para melhorar a sua experiência:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Essenciais:</strong> para funcionamento do site (carrinho, login)</li>
              <li><strong>Analíticos:</strong> para entender como usa o site</li>
              <li><strong>Marketing:</strong> para mostrar promoções relevantes (com consentimento)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Pode gerir as suas preferências de cookies nas definições do browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Menores de Idade</h2>
            <p className="text-muted-foreground">
              O nosso website não é direcionado a menores de 18 anos. Não recolhemos 
              intencionalmente dados de menores. Se souber que recolhemos dados de um menor, 
              contacte-nos para os eliminarmos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Alterações a esta Política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta política periodicamente. Qualquer alteração será publicada 
              nesta página. Recomendamos que revera esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Reclamações</h2>
            <p className="text-muted-foreground">
              Se não estiver satisfeito com o nosso tratamento dos seus dados, pode apresentar 
              uma reclamação diretamente connosco ou junto da autoridade de proteção de dados 
              de Moçambique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contacto</h2>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p><strong>Marrengula-IT - Encarregado de Proteção de Dados</strong></p>
              <p>Email: marrengulait@gmail.com</p>
              <p>Telefone: +258 864738133</p>
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
