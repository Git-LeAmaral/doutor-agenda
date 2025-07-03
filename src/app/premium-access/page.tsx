
import { Badge } from "@/components/ui/badge"

import { SubscriptionPlan } from "../(protected)/subscription/_components/subscription-plan"

export default function SubscriptionRequiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 px-4 py-2">
            🚀 Desbloqueie Todo o Potencial
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme Sua Clínica em uma
            <span className="text-emerald-600 block">Máquina de Resultados</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Pare de perder tempo com planilhas e anotações. Mais de <strong>10.000 profissionais </strong>
            já descobriram como nossa plataforma pode <strong>triplicar sua produtividade</strong> e
            <strong>dobrar sua receita</strong> em apenas 30 dias.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">300%</div>
              <div className="text-sm text-gray-600">Aumento na Produtividade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">Redução em Faltas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-gray-600">Economia por Semana</div>
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Você está perdendo dinheiro todos os dias sem perceber...
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Pacientes faltando sem avisar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Horários vagos que poderiam estar gerando receita</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Tempo perdido com ligações e confirmações manuais</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Dificuldade para acompanhar métricas importantes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Pacientes insatisfeitos com a desorganização</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Estresse constante tentando gerenciar tudo manualmente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">A Solução Está Aqui 👇</h2>
          <p className="text-lg text-gray-600 mb-8">
            Comece hoje mesmo e veja a diferença em <strong>7 dias</strong>. Garantia de satisfação ou seu dinheiro de
            volta!
          </p>
        </div>

        {/* Subscription Card */}
        <div className="flex justify-center mb-12">
          <SubscriptionPlan active={false} />
        </div>

        {/* Urgency */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border border-orange-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ⚡ Oferta Limitada - Apenas para os Primeiros 100 Usuários
          </h3>
          <p className="text-gray-700">
            Não perca esta oportunidade única. Milhares de profissionais já estão na nossa lista de espera.
            <strong> Garante sua vaga agora!</strong>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Confiado por mais de 10.000+ profissionais</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl">🏥</div>
            <div className="text-2xl">👨‍⚕️</div>
            <div className="text-2xl">🦷</div>
            <div className="text-2xl">👩‍⚕️</div>
            <div className="text-2xl">🩺</div>
          </div>
        </div>
      </div>
    </div>
  )
}
