
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import EducationWork from './components/EducationWork';
import Others from './components/Others';
import { usePortfolio } from './hooks/usePortfolio';
import AdminCMS from './components/AdminCMS';

const App: React.FC = () => {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminCMS />;
  }
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: profileData, error, isLoading } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'education', 'research', 'projects', 'others'];
      
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        setActiveSection('others');
        return;
      }

      let current = 'home';
      const scrollThreshold = 300;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= scrollThreshold) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-500">Loading</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-900">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-rose-500">Error</p>
          <h1 className="text-2xl font-bold tracking-tight">Failed to load portfolio data.</h1>
          {error && <p className="mt-4 text-sm text-slate-500">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white selection:bg-indigo-500/30">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation"
        className="fixed right-4 top-4 z-40 flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-slate-200 bg-white/90 text-slate-900 shadow-lg backdrop-blur transition-all hover:border-slate-900 lg:hidden"
      >
        <span className="h-0.5 w-5 bg-current"></span>
        <span className="h-0.5 w-5 bg-current"></span>
        <span className="h-0.5 w-5 bg-current"></span>
      </button>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <Sidebar
        activeSection={activeSection}
        profileData={profileData}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-[280px] w-full overflow-x-hidden">
        <Hero profileData={profileData} />
        
        <EducationWork profileData={profileData} />

        {/* Research Section */}
        <section id="research" className="py-32 px-6 bg-[#f8fafc] min-h-[500px] border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 tracking-tight">Research</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
              {profileData.research.map((item) => (
                <div key={item.id} className="group p-10 md:p-14 bg-white rounded-none shadow-sm border border-slate-200 hover:border-rose-200 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-10 items-start relative">
                  
                  {item.now && (
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Ongoing</span>
                    </div>
                  )}

                  {/* Research Image (Diagram/Architecture) */}
                  <div className="flex-shrink-0 w-full md:w-48 aspect-video md:aspect-square bg-slate-100 border border-slate-200 overflow-hidden group-hover:border-rose-100 transition-colors">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-3xl font-bold mb-4 text-slate-900 group-hover:text-rose-500 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-bold px-4 py-2 bg-slate-50 text-slate-500 rounded-none uppercase tracking-widest border border-slate-200">{tag}</span>
                      ))}
                    </div>
                    
                    {item.link && (
                      <div className="inline-flex w-fit items-center gap-1.5 border border-rose-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 transition-all group-hover:border-rose-200 group-hover:bg-rose-50 group-hover:text-rose-500">
                        Learn More <span aria-hidden="true" className="text-xs leading-none">↗</span>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="absolute inset-0 z-10"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 bg-white min-h-[700px] border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 tracking-tight">Projects</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profileData.projects.map(project => (
                <div key={project.id} className="group relative flex flex-col bg-white rounded-none border border-slate-200 overflow-hidden hover:border-rose-200 hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex flex-nowrap gap-1.5 mb-4 overflow-hidden whitespace-nowrap">
                      {project.tech.map(t => (
                        <span key={t} className="flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-none uppercase tracking-normal border border-indigo-100">{t}</span>
                      ))}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-500 transition-colors">{project.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                    {project.link && (
                      <div className="inline-flex w-fit items-center gap-1.5 border border-rose-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 transition-all group-hover:border-rose-200 group-hover:bg-rose-50 group-hover:text-rose-500">
                        Learn More <span aria-hidden="true" className="text-xs leading-none">↗</span>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="absolute inset-0 z-10"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Others profileData={profileData} />

        <footer className="h-[84px] px-6 border-t border-white/5 bg-[#0a0a0a] flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center w-full">
            <div className="w-6 h-[1px] bg-indigo-500/50 mx-auto mb-2"></div>
            <p className="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} {profileData.englishName}. All Rights Reserved.
            </p>
            <p className="text-slate-600 text-[8px] mt-1 tracking-widest uppercase opacity-40 font-bold">
              {profileData.universityName} {profileData.labName}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
