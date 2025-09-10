import { useNavigate } from 'react-router';
import { 
  FileText, 
  Calendar, 
  Apple, 
  TrendingUp, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: FileText,
      title: 'Anamnese Digital',
      description: 'Preencha seu histórico completo e centralize todas as informações de saúde.'
    },
    {
      icon: Calendar,
      title: 'Atualizações Quinzenais',
      description: 'Registre suas medidas e peso a cada 15 dias e acompanhe sua evolução.'
    },
    {
      icon: Apple,
      title: 'Dietas Personalizadas',
      description: 'Receba planos alimentares criados sob medida pelo seu treinador.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios e Gráficos',
      description: 'Visualize seu progresso em gráficos claros e detalhados.'
    }
  ];

  const testimonials = [
    {
      text: "Com o NutriTrack Pro, consegui organizar minha rotina de treinos e dieta. Hoje acompanho meus resultados de forma prática e visual.",
      author: "João Mendes"
    },
    {
      text: "Como treinador, nunca foi tão fácil acompanhar meus alunos e personalizar planos alimentares. Recomendo muito!",
      author: "Carla Souza"
    },
    {
      text: "Adorei o app! Muito intuitivo, fácil de usar e com relatórios detalhados. Agora tenho tudo em um único lugar.",
      author: "Pedro Lima"
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-2xl backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/Captura-de-tela-2025-09-08-151739.png" 
              alt="NutriTrack Pro" 
              className="w-8 h-8 drop-shadow-lg"
            />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">NutriTrack Pro</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 text-white font-medium">
              <li>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="hover:text-cyan-300 transition-colors duration-300"
                >
                  Funcionalidades
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('depoimentos')} 
                  className="hover:text-cyan-300 transition-colors duration-300"
                >
                  Depoimentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-cyan-400 to-pink-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:from-cyan-300 hover:to-pink-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Entrar no App
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 md:hidden backdrop-blur-lg">
              <ul className="flex flex-col space-y-4 p-6 text-white font-medium">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="hover:text-cyan-300 transition-colors w-full text-left"
                  >
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('depoimentos')} 
                    className="hover:text-cyan-300 transition-colors w-full text-left"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-cyan-400 to-pink-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:from-cyan-300 hover:to-pink-300 transition-all duration-300 w-full"
                  >
                    Entrar no App
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 relative">
        {/* Background glow effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        
        <div className="flex-1 md:pr-6 z-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Sua saúde, seu progresso, sua transformação!
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Preencha sua anamnese completa, registre peso e medidas, atualize seus resultados quinzenalmente 
            e receba dietas personalizadas diretamente do seu treinador. Tudo em um único aplicativo!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105 hover:from-pink-400 hover:to-cyan-400"
            >
              <span>Quero começar agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-gradient-to-r from-pink-400 to-cyan-400 text-pink-400 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-cyan-500/10 transition-all duration-300 backdrop-blur-sm"
              style={{
                borderImage: 'linear-gradient(45deg, #ec4899, #06b6d4) 1'
              }}
            >
              Saiba mais
            </button>
          </div>
        </div>
        <div className="flex-1 mt-10 md:mt-0 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 rounded-2xl blur-xl"></div>
            <img 
              src="https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/istockphoto-1362684836-612x612.jpg" 
              alt="Casal de fitness - NutriTrack Pro" 
              className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-white/20 backdrop-blur-sm object-cover h-96" 
            />
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Por que escolher o NutriTrack Pro?
          </h3>
          <p className="mt-4 text-gray-300">
            Tudo que você precisa para acompanhar sua evolução física em um só lugar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-white/10 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-pink-300 transition-colors duration-300">{feature.title}</h4>
                <p className="mt-2 text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            O que nossos usuários dizem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-white/10 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <p className="text-gray-300 italic mb-4">"{testimonial.text}"</p>
                <h4 className="font-semibold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">{testimonial.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold drop-shadow-lg">Pronto para transformar sua saúde?</h3>
          <p className="mt-4 text-lg text-gray-100">
            Acesse agora e comece a acompanhar sua evolução de forma inteligente.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-cyan-400 to-pink-400 text-slate-900 px-8 py-4 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2 transform hover:scale-105 hover:from-cyan-300 hover:to-pink-300"
            >
              <span>Acessar App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce animation-delay-2000"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-6 text-center text-gray-400">
        <p>&copy; 2025 NutriTrack Pro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
