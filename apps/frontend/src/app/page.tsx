import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-950 via-cyan-950 to-gray-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]">
            <div className="text-center md:text-left animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  💪 EvolucaoFit
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
                Acompanhe sua evolução física de forma simples e eficiente.
                Registre treinos, medidas, refeições e conquiste seus objetivos!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-lg hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-cyan-500/50"
                >
                  Começar Agora
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 text-white rounded-lg font-semibold text-lg hover:bg-gray-700/50 hover:border-cyan-500/50 transform hover:scale-105 transition-all duration-200"
                >
                  Entrar
                </Link>
              </div>
            </div>
            <div className="text-center animate-bounce-slow">
              <div className="text-9xl md:text-[12rem] filter drop-shadow-2xl">
                🏋️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-950 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Medidas Corporais',
                description: 'Registre peso, altura, circunferências e acompanhe sua evolução com gráficos detalhados'
              },
              {
                icon: '🏋️',
                title: 'Treinos',
                description: 'Registre seus treinos, exercícios, séries e repetições. Acompanhe seu progresso'
              },
              {
                icon: '🥗',
                title: 'Nutrição',
                description: 'Controle sua alimentação, registre refeições e monitore seus macronutrientes'
              },
              {
                icon: '📸',
                title: 'Fotos de Progresso',
                description: 'Tire fotos e compare sua evolução visual ao longo do tempo'
              },
              {
                icon: '🎯',
                title: 'Metas e Objetivos',
                description: 'Defina suas metas e acompanhe seu progresso rumo aos objetivos'
              },
              {
                icon: '📈',
                title: 'Relatórios',
                description: 'Visualize gráficos e relatórios detalhados da sua evolução'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-lg shadow-black/50 hover:shadow-2xl hover:shadow-cyan-900/30 transform hover:-translate-y-2 transition-all duration-300 border border-gray-800 hover:border-cyan-500/50"
              >
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para começar?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-400 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão transformando suas vidas
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© 2025 EvolucaoFit - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}

