import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Camera, 
  Users, 
  Award, 
  ChevronRight, 
  Send, 
  Loader2, 
  CheckCircle2, 
  History,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { generatePortraitContent } from './services/geminiService';
import { Portrait, QuestionnaireData } from './types';

// --- Components ---

const Navbar = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-serif italic text-xl font-bold tracking-tight text-stone-900">
            Agence des Portraits
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('home')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Accueil</button>
          <button onClick={() => onNavigate('gallery')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Livre d'Or</button>
          <button 
            onClick={() => onNavigate('create')}
            className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
          >
            Créer mon Portrait
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold tracking-widest uppercase mb-6">
          Héritage Académique • UPL • UNH • UDBL • ECOPO
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-light text-stone-900 leading-tight mb-8">
          Transformez votre réussite en un <span className="italic">héritage durable</span>.
        </h1>
        <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          L'Agence des Portraits immortalise votre parcours universitaire à travers des portraits rédigés par IA et conservés dans le Livre d'Or officiel de votre institution.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
          >
            Commencer mon Portrait <ChevronRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-stone-200 text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-all">
            Découvrir le Livre d'Or
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 bg-white border border-stone-100 rounded-3xl hover:shadow-xl hover:shadow-stone-100 transition-all duration-300">
    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="text-stone-900 w-6 h-6" />
    </div>
    <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{title}</h3>
    <p className="text-stone-500 leading-relaxed">{description}</p>
  </div>
);

const Features = () => (
  <section className="py-20 bg-stone-50/50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={GraduationCap}
          title="Excellence Académique"
          description="Dédié aux étudiants de fin de cycle, valorisant particulièrement la réussite en première session."
        />
        <FeatureCard 
          icon={Building2}
          title="Partenariats Officiels"
          description="Vos portraits sont archivés dans les bibliothèques universitaires et présentés aux instances politiques."
        />
        <FeatureCard 
          icon={ShieldCheck}
          title="Sécurité des Données"
          description="Une infrastructure robuste pour garantir la pérennité et la confidentialité de votre héritage numérique."
        />
      </div>
    </div>
  </section>
);

// --- Main App Logic ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [portraits, setPortraits] = useState<Portrait[]>([]);
  const [formData, setFormData] = useState<QuestionnaireData>({
    fullName: '',
    university: 'UPL',
    faculty: '',
    major: '',
    graduationYear: '2026',
    background: '',
    keyMoments: '',
    futureAspirations: '',
    motto: ''
  });
  const [generatedPortrait, setGeneratedPortrait] = useState<any>(null);

  useEffect(() => {
    fetchPortraits();
  }, []);

  const fetchPortraits = async () => {
    try {
      const res = await fetch('/api/portraits');
      const data = await res.json();
      setPortraits(data);
    } catch (err) {
      console.error("Failed to fetch portraits", err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const content = await generatePortraitContent(formData);
      setGeneratedPortrait(content);
      setCurrentPage('preview');
    } catch (err) {
      console.error("Generation error:", err);
      alert("Erreur lors de la génération du portrait. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const newPortrait: Portrait = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: formData.fullName,
      university: formData.university as any,
      faculty: formData.faculty,
      graduationYear: parseInt(formData.graduationYear),
      biography: generatedPortrait.biography,
      achievements: generatedPortrait.achievements,
      vision: generatedPortrait.vision,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/portraits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPortrait)
      });
      await fetchPortraits();
      setCurrentPage('success');
    } catch (err) {
      console.error("Save error:", err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
      <Navbar onNavigate={setCurrentPage} />

      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onStart={() => setCurrentPage('create')} />
              <Features />
              
              <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-3xl font-serif font-bold mb-2">Dernières Inscriptions</h2>
                      <p className="text-stone-500">Les nouveaux visages du Livre d'Or.</p>
                    </div>
                    <button 
                      onClick={() => setCurrentPage('gallery')}
                      className="text-sm font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2"
                    >
                      Voir tout <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portraits.slice(0, 4).map((p) => (
                      <div key={p.id} className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-stone-100 rounded-2xl mb-4 overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                            <Users className="w-12 h-12" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">{p.university}</p>
                            <p className="text-white/80 text-xs">{p.faculty}</p>
                          </div>
                        </div>
                        <h4 className="font-serif font-bold text-lg">{p.studentName}</h4>
                        <p className="text-stone-400 text-sm">Classe de {p.graduationYear}</p>
                      </div>
                    ))}
                    {portraits.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-3xl">
                        <p className="text-stone-400">Aucun portrait pour le moment. Soyez le premier !</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-32 pb-20 px-4 max-w-3xl mx-auto"
            >
              <button 
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-stone-400 hover:text-stone-900 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              
              <div className="mb-12">
                <h2 className="text-4xl font-serif font-bold mb-4">Votre Questionnaire</h2>
                <p className="text-stone-500">Répondez à ces quelques questions pour que notre IA puisse structurer votre portrait d'héritage.</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Nom Complet</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Université</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all bg-white"
                      value={formData.university}
                      onChange={e => setFormData({...formData, university: e.target.value})}
                    >
                      <option>UPL</option>
                      <option>UNH</option>
                      <option>UDBL</option>
                      <option>ECOPO</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Faculté</label>
                    <input 
                      required
                      placeholder="ex: Sciences Économiques"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                      value={formData.faculty}
                      onChange={e => setFormData({...formData, faculty: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Année de Graduation</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                      value={formData.graduationYear}
                      onChange={e => setFormData({...formData, graduationYear: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Parcours & Origines</label>
                  <textarea 
                    required
                    placeholder="Décrivez brièvement votre parcours avant l'université..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all min-h-[100px]"
                    value={formData.background}
                    onChange={e => setFormData({...formData, background: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Moments Clés à l'Université</label>
                  <textarea 
                    required
                    placeholder="Quels sont les événements qui ont marqué votre cursus ?"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all min-h-[100px]"
                    value={formData.keyMoments}
                    onChange={e => setFormData({...formData, keyMoments: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Vision & Aspirations</label>
                  <textarea 
                    required
                    placeholder="Où vous voyez-vous dans 5 ou 10 ans ? Quel impact voulez-vous avoir ?"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all min-h-[100px]"
                    value={formData.futureAspirations}
                    onChange={e => setFormData({...formData, futureAspirations: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Camera className="w-5 h-5" /> Générer mon Portrait</>}
                </button>
              </form>
            </motion.div>
          )}

          {currentPage === 'preview' && generatedPortrait && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20 px-4 max-w-4xl mx-auto"
            >
              <div className="bg-stone-50 p-12 rounded-[40px] border border-stone-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <BookOpen className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 block mb-2">Portrait d'Héritage</span>
                      <h2 className="text-5xl font-serif font-bold text-stone-900">{formData.fullName}</h2>
                      <p className="text-stone-500 mt-2">{formData.university} • {formData.faculty} • Classe de {formData.graduationYear}</p>
                    </div>
                    <div className="w-20 h-20 bg-stone-900 rounded-2xl flex items-center justify-center text-white">
                      <Award className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Biographie</h3>
                        <p className="text-lg leading-relaxed text-stone-700 font-serif italic">
                          "{generatedPortrait.biography}"
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Vision d'Avenir</h3>
                        <p className="text-stone-600 leading-relaxed">
                          {generatedPortrait.vision}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Réalisations</h3>
                        <ul className="space-y-3">
                          {generatedPortrait.achievements.map((a: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-stone-600">
                              <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setCurrentPage('create')}
                  className="px-8 py-4 border border-stone-200 text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-all"
                >
                  Modifier les informations
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Confirmer & Publier au Livre d'Or</>}
                </button>
              </div>
            </motion.div>
          )}

          {currentPage === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-40 pb-20 px-4 text-center max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-stone-900" />
              </div>
              <h2 className="text-4xl font-serif font-bold mb-4">Félicitations !</h2>
              <p className="text-stone-600 text-lg mb-10">
                Votre portrait a été généré avec succès et soumis pour révision. Une fois validé, il sera officiellement inscrit dans le Livre d'Or de votre université.
              </p>
              <button 
                onClick={() => setCurrentPage('home')}
                className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-all"
              >
                Retour à l'accueil
              </button>
            </motion.div>
          )}

          {currentPage === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20 px-4"
            >
              <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                  <h2 className="text-5xl font-serif font-bold mb-4">Le Livre d'Or</h2>
                  <p className="text-stone-500 max-w-xl mx-auto">Découvrez les parcours inspirants des étudiants des universités UPL, UNH et UDBL.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {portraits.map((p) => (
                    <div key={p.id} className="bg-white border border-stone-100 p-8 rounded-3xl hover:shadow-2xl hover:shadow-stone-100 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-300 group-hover:text-stone-900 transition-colors">
                          <Users className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
                          {p.university}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold mb-2">{p.studentName}</h3>
                      <p className="text-stone-400 text-sm mb-6">{p.faculty} • Classe de {p.graduationYear}</p>
                      <p className="text-stone-600 line-clamp-3 italic mb-8">"{p.biography}"</p>
                      <button className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                        Lire le portrait <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {portraits.length === 0 && (
                  <div className="text-center py-40">
                    <History className="w-16 h-16 text-stone-100 mx-auto mb-6" />
                    <p className="text-stone-400">Le Livre d'Or est en cours de rédaction...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-stone-100 bg-stone-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center">
              <BookOpen className="text-white w-3 h-3" />
            </div>
            <span className="font-serif italic text-lg font-bold tracking-tight text-stone-900">
              Agence des Portraits
            </span>
          </div>
          <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
            Une initiative visant à fédérer les étudiants et à conserver des souvenirs durables de leur parcours académique.
          </p>
          <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-8">
            Lubumbashi : Avenue Mama Yemo, n° 1575, Commune de Lubumbashi (Collège IMARA)
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-stone-400">
            <a href="#" className="hover:text-stone-900 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Conditions</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Contact</a>
          </div>
          <p className="mt-12 text-[10px] text-stone-300 uppercase tracking-[0.3em]">
            © 2026 Agence des Portraits : Ecole-Famille-Entreprise
          </p>
        </div>
      </footer>
    </div>
  );
}
