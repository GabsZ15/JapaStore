import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Como funciona a política de trocas?',
    answer: 'Você tem até 7 dias corridos após o recebimento do pedido para solicitar a troca ou devolução. O produto deve estar com a etiqueta original, sem indícios de uso e na embalagem original.'
  },
  {
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo varia de acordo com a sua região e a modalidade de frete escolhida. Normalmente, pedidos para o Sudeste chegam em até 3 dias úteis, e para as demais regiões entre 5 a 10 dias úteis.'
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos PIX (com 5% de desconto), cartões de crédito (Visa, MasterCard, Elo) em até 12x.'
  },
  {
    question: 'Como rastrear meu pedido?',
    answer: 'Assim que o pedido for despachado, você receberá o código de rastreio por e-mail. Você também pode acompanhá-lo acessando sua conta na seção "Meus Pedidos".'
  },
  {
    question: 'As peças encolhem ao lavar?',
    answer: 'Nossas peças são pré-encolhidas no processo de fabricação. No entanto, recomendamos seguir rigorosamente as instruções de lavagem presentes na etiqueta de cada produto para garantir sua durabilidade.'
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950/50 py-16 md:py-24 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white transition-colors duration-300">
            Dúvidas Frequentes
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Tudo o que você precisa saber sobre compras, entregas e suporte.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide text-sm pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Ainda tem dúvidas?</p>
          <a 
            href="/contato" 
            className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs px-8 py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Fale com a gente
          </a>
        </div>

      </div>
    </main>
  );
}
