
import { User, Project, ScalingConfig, Pipeline, Recommendation } from '../types';

/**
 * MOCK DATABASE
 * In a real app, this would be MongoDB/PostgreSQL.
 */

const MOCK_USERS: User[] = []; // Cleared initial users

const MOCK_PROJECTS: Project[] = []; // Cleared initial projects

/**
 * BACKEND SERVICES
 */

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email && u.passwordHash === password);
        if (user) {
          // Generate a fake JWT (base64 of userId)
          const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 3600000 }));
          resolve({ user: { ...user, token }, token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },

  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `u_${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          passwordHash: password,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          createdAt: new Date()
        };
        MOCK_USERS.push(newUser);
        const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 3600000 }));
        resolve({ user: { ...newUser, token }, token });
      }, 1000);
    });
  },

  loginAsDemo: async (): Promise<{ user: User; token: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoUser: User = {
          id: 'u_demo_guest',
          name: 'Guest User',
          email: 'guest@demo.com',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
          createdAt: new Date(),
        };

        // Check if user exists or just overwrite/add to mock DB
        if (!MOCK_USERS.find(u => u.id === demoUser.id)) {
            MOCK_USERS.push(demoUser);
        }
        
        // Seed a demo project for this user if it doesn't exist
        if (!MOCK_PROJECTS.find(p => p.userId === demoUser.id)) {
             const demoProject: Project = {
                id: `p_demo_${Date.now()}`,
                userId: demoUser.id,
                name: 'E-Commerce Backend (Demo)',
                description: 'A demo e-commerce API to visualize scaling and deployment pipelines.',
                repoUrl: 'github.com/demo/ecommerce-api',
                cloudProvider: 'AWS',
                region: 'us-east-1',
                status: 'warning',
                lastDeployment: '2 hours ago',
                scalingConfig: {
                  id: `sc_demo_${Date.now()}`,
                  projectId: 'temp', // Updated below
                  targetType: 'EC2',
                  minInstances: 2,
                  maxInstances: 10,
                  scaleUpThresholdCPU: 70,
                  scaleDownThresholdCPU: 30,
                  scaleDownCooldown: 300
                },
                pipeline: {
                  id: `pl_demo_${Date.now()}`,
                  projectId: 'temp', // Updated below
                  ciProvider: 'GitHub Actions',
                  branch: 'main',
                  dockerfilePath: './Dockerfile',
                  deployTarget: 'EC2',
                  autoRollbackEnabled: true,
                  healthCheckEndpoint: '/health',
                  healthCheckMethod: 'GET',
                  healthCheckStatus: 200,
                  postDeployCommand: 'npm run test:smoke',
                  status: 'Active'
                },
                recommendations: [
                  {
                    id: `rec_demo_1_${Date.now()}`,
                    projectId: 'temp',
                    type: 'Cost',
                    title: 'Downsize Idle Instances',
                    description: 'Traffic analysis shows 2 instances are idle between 2AM-5AM.',
                    impact: 'Save ~$45/mo',
                    status: 'Pending',
                    createdAt: new Date()
                  },
                  {
                    id: `rec_demo_2_${Date.now()}`,
                    projectId: 'temp',
                    type: 'Performance',
                    title: 'Upgrade EBS Volume',
                    description: 'IOPS credits are depleting during peak hours.',
                    impact: 'Reduce latency by 150ms',
                    status: 'Pending',
                    createdAt: new Date()
                  }
                ]
              };
              
              // Fixup IDs
              demoProject.scalingConfig.projectId = demoProject.id;
              if (demoProject.pipeline) demoProject.pipeline.projectId = demoProject.id;
              if (demoProject.recommendations) {
                  demoProject.recommendations.forEach(r => r.projectId = demoProject.id);
              }

              MOCK_PROJECTS.push(demoProject);
        }
        
        const token = btoa(JSON.stringify({ userId: demoUser.id, exp: Date.now() + 3600000 }));
        resolve({ user: { ...demoUser, token }, token });
      }, 1500);
    });
  },

  // Verify token and return user (Session check)
  me: async (token: string): Promise<User | null> => {
    try {
      const decoded = JSON.parse(atob(token));
      const user = MOCK_USERS.find(u => u.id === decoded.userId);
      return user || null;
    } catch (e) {
      return null;
    }
  }
};

export const projectService = {
  getByUser: async (userId: string): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PROJECTS.filter(p => p.userId === userId));
      }, 500);
    });
  },

  create: async (userId: string, data: Partial<Project>): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject: Project = {
          id: `p_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          name: data.name || 'Untitled Project',
          description: data.description || '',
          repoUrl: data.repoUrl || '',
          cloudProvider: data.cloudProvider || 'AWS',
          region: data.region || 'us-east-1',
          status: 'healthy',
          lastDeployment: 'Never',
          scalingConfig: {
            id: `sc_${Math.random().toString(36).substr(2, 9)}`,
            projectId: 'temp', // set below
            targetType: 'EC2',
            minInstances: 1,
            maxInstances: 2,
            scaleUpThresholdCPU: 80,
            scaleDownThresholdCPU: 20,
            scaleDownCooldown: 300
          },
          recommendations: []
        };
        
        newProject.scalingConfig.projectId = newProject.id;
        MOCK_PROJECTS.push(newProject);
        resolve(newProject);
      }, 1000);
    });
  },

  update: async (project: Project): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_PROJECTS.findIndex(p => p.id === project.id);
        if (index !== -1) {
          MOCK_PROJECTS[index] = project;
        }
        resolve();
      }, 500);
    });
  },

  delete: async (projectId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_PROJECTS.findIndex(p => p.id === projectId);
        if (index !== -1) {
          MOCK_PROJECTS.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },

  updateConfig: async (projectId: string, config: ScalingConfig): Promise<void> => {
    const proj = MOCK_PROJECTS.find(p => p.id === projectId);
    if (proj) {
      proj.scalingConfig = config;
    }
  }
};
