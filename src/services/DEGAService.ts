import axios from 'axios';
import EventEmitter from 'events';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'request' | 'response' | 'notification';
  timestamp: number;
  metadata?: any;
}

interface TaskRequest {
  taskId: string;
  requester: string;
  executor: string;
  taskType: string;
  parameters: any;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

interface DEGAAgent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'online' | 'offline' | 'busy';
  endpoint?: string;
}

export class DEGAService extends EventEmitter {
  private apiEndpoint: string;
  private apiKey?: string;
  private jwtSecret: string;
  private registeredAgents: Map<string, DEGAAgent> = new Map();

  constructor() {
    super();
    this.apiEndpoint = config.blockchain.degaApiEndpoint;
    this.apiKey = process.env.DEGA_API_KEY;
    this.jwtSecret = process.env.JWT_SECRET || 'dega-treasury-secret-change-in-production';
  }

  async registerAgent(agent: DEGAAgent): Promise<void> {
    this.registeredAgents.set(agent.id, agent);
    this.emit('agent:registered', agent);

    if (!this.apiKey) {
      return;
    }

    try {
      await axios.post(
        `${this.apiEndpoint}/agents/register`,
        agent,
        {
          headers: this.getHeaders(),
          timeout: 5000
        }
      );
    } catch (error) {
      // fallback to local registry only
    }
  }

  async discoverAgents(): Promise<DEGAAgent[]> {
    if (!this.apiKey) {
      return Array.from(this.registeredAgents.values());
    }

    try {
      const response = await axios.get(`${this.apiEndpoint}/agents`, {
        headers: this.getHeaders(),
        timeout: 5000
      });
      return response.data?.agents || Array.from(this.registeredAgents.values());
    } catch (error) {
      return Array.from(this.registeredAgents.values());
    }
  }

  async sendMessage(targetAgent: string, content: string, type: 'request' | 'response' | 'notification' = 'request'): Promise<AgentMessage> {
    const message: AgentMessage = {
      id: `msg_${Date.now()}`,
      from: 'PrivacyTreasuryAI',
      to: targetAgent,
      content,
      type,
      timestamp: Date.now()
    };

    if (this.apiKey) {
      try {
        await axios.post(`${this.apiEndpoint}/agents/${targetAgent}/messages`, message, {
          headers: this.getHeaders(),
          timeout: 4000
        });
      } catch (error) {
        // ignore, rely on local event bus
      }
    }

    this.emit('message:sent', message);
    return message;
  }

  async requestTask(executorAgent: string, taskType: string, parameters: any): Promise<TaskRequest> {
    const task: TaskRequest = {
      taskId: `task_${Date.now()}`,
      requester: 'PrivacyTreasuryAI',
      executor: executorAgent,
      taskType,
      parameters,
      status: 'pending'
    };

    if (this.apiKey) {
      try {
        await axios.post(`${this.apiEndpoint}/tasks`, task, {
          headers: this.getHeaders(),
          timeout: 4000
        });
        task.status = 'executing';
      } catch (error) {
        task.status = 'pending';
      }
    }

    this.emit('task:created', task);
    return task;
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return headers;
  }
}

export const degaService = new DEGAService();
