
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MONITORING = 'MONITORING',
  PIPELINE = 'PIPELINE',
  ADVISOR = 'ADVISOR',
  GENERATOR = 'GENERATOR',
  SETTINGS = 'SETTINGS'
}

export enum Page {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  APP = 'APP',
  FEATURES = 'FEATURES',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  DOCS = 'DOCS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // In real app, never store plain text. Mocking logic.
  avatarUrl?: string;
  createdAt: Date;
  token?: string; // Simulated JWT
}

export interface ScalingConfig {
  id: string;
  projectId: string;
  targetType: 'EC2' | 'Lambda' | 'K8s_Pod';
  minInstances: number;
  maxInstances: number;
  scaleUpThresholdCPU: number; // Percentage
  scaleDownThresholdCPU: number; // Percentage
  scaleDownCooldown: number; // Seconds
}

export interface Pipeline {
  id: string;
  projectId: string;
  ciProvider: 'GitHub Actions' | 'GitLab CI' | 'Jenkins';
  branch: string;
  dockerfilePath: string;
  deployTarget: 'EC2' | 'Lambda' | 'S3+CloudFront';
  autoRollbackEnabled: boolean;
  healthCheckEndpoint?: string;
  healthCheckMethod?: 'GET' | 'POST' | 'HEAD';
  healthCheckStatus?: number;
  postDeployCommand?: string;
  status: 'Active' | 'Paused';
}

export interface Recommendation {
  id: string;
  projectId: string;
  type: 'Performance' | 'Cost' | 'Reliability';
  title: string;
  description: string;
  impact: string; // e.g. "Save $50/mo"
  status: 'Pending' | 'Applied' | 'Ignored';
  createdAt: Date;
}

// The Project interface acts as the aggregate root for the frontend
export interface Project {
  id: string;
  userId: string; // Foreign Key
  name: string;
  description: string;
  repoUrl: string;
  cloudProvider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  status: 'healthy' | 'warning' | 'critical';
  lastDeployment: string;
  
  // Hydrated fields (in a real API, these might be separate fetches, but we bundle them for UI convenience)
  scalingConfig: ScalingConfig;
  pipeline?: Pipeline;
  recommendations?: Recommendation[];
}

export interface MetricPoint {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  logs: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ScriptType {
  DOCKERFILE = 'Dockerfile',
  GITHUB_ACTION = 'GitHub Action',
  TERRAFORM = 'Terraform AWS',
  KUBERNETES = 'Kubernetes Manifest'
}
