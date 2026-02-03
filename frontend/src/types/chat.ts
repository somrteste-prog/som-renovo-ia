export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserContext {
  name: string;
  sector: string;
  additionalContext?: string;
}

export interface WebhookPayload {
  mensagem: string;
  nome_usuario: string;
  setor: string;
  contexto_cliente?: string;
  objetivo_pergunta?: string;
}

export interface WebhookResponse {
  resposta: string;
  passos?: string[];
  sugestoes?: string[];
  perguntas_refinamento?: string[];
}