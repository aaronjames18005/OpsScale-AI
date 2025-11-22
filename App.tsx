
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Monitoring } from './components/Monitoring';
import { PipelineView } from './components/PipelineView';
import { AIAdvisor } from './components/AIAdvisor';
import { ScriptGenerator } from './components/ScriptGenerator';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { LandingPage } from './components/LandingPage';
import { ProjectSelection } from './components/ProjectSelection';
import { Settings } from './components/Settings';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { DocsPage } from './components/DocsPage';
import { AppView, User, Project, Page } from './types';
import { projectService, authService } from './services/mockBackend';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch projects whenever user changes (logs in)
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    setIsLoadingProjects(true);
    try {
      const userProjects = await projectService.getByUser(user.id);
      setProjects(userProjects);
    } catch (e) {
      console.error("Failed to load projects", e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage(Page.APP);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedProject(null);
    setCurrentPage(Page.LANDING);
  };
  
  const handleViewDemo = async () => {
    try {
       const { user } = await authService.loginAsDemo();
       handleLogin(user);
    } catch (e) {
       console.error("Demo login failed", e);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    // Update local state immediately for UI responsiveness
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    // Persist to backend
    projectService.update(updatedProject);
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
         await projectService.delete(projectId);
         setProjects(projects.filter(p => p.id !== projectId));
         setSelectedProject(null);
    }
  };

  const renderAppView = () => {
    if (!selectedProject) return null;

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard project={selectedProject} onUpdateProject={handleUpdateProject} />;
      case AppView.MONITORING:
        return <Monitoring />;
      case AppView.PIPELINE:
        return <PipelineView 
          project={selectedProject} 
          onUpdateProject={handleUpdateProject} 
          onDeleteProject={handleDeleteProject} 
        />;
      case AppView.ADVISOR:
        return <AIAdvisor project={selectedProject} />;
      case AppView.GENERATOR:
        return <ScriptGenerator />;
      case AppView.SETTINGS:
        return <Settings project={selectedProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} />;
      default:
        return <Dashboard project={selectedProject} onUpdateProject={handleUpdateProject} />;
    }
  };

  // Router Logic
  switch (currentPage) {
    case Page.LANDING:
      return <LandingPage onNavigate={setCurrentPage} onViewDemo={handleViewDemo} />;
    case Page.FEATURES:
      return <FeaturesPage onNavigate={setCurrentPage} />;
    case Page.HOW_IT_WORKS:
      return <HowItWorksPage onNavigate={setCurrentPage} />;
    case Page.DOCS:
      return <DocsPage onNavigate={setCurrentPage} />;
    case Page.LOGIN:
      return <LoginScreen onLogin={handleLogin} onNavigate={setCurrentPage} />;
    case Page.SIGNUP:
      return <SignUpScreen onLogin={handleLogin} onNavigate={setCurrentPage} />;
    case Page.FORGOT_PASSWORD:
      return <ForgotPasswordScreen onNavigate={setCurrentPage} />;
    case Page.APP:
      if (user) {
        if (!selectedProject) {
          return (
            <ProjectSelection 
              user={user} 
              projects={projects} 
              onSelectProject={setSelectedProject} 
              onLogout={handleLogout}
              refreshProjects={loadProjects}
            />
          );
        }

        return (
          <div className="flex h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              project={selectedProject}
              onSwitchProject={() => setSelectedProject(null)}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-hidden relative flex flex-col bg-slate-900/50">
              <div className="flex-1 overflow-hidden">
                {renderAppView()}
              </div>
            </main>
          </div>
        );
      }
      // Fallthrough if no user but page is APP
      return <LandingPage onNavigate={setCurrentPage} onViewDemo={handleViewDemo} />;
    default:
      return <LandingPage onNavigate={setCurrentPage} onViewDemo={handleViewDemo} />;
  }
};

export default App;
