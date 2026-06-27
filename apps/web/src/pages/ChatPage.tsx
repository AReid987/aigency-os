import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import { MessageSquare, Send, Paperclip, Search } from 'lucide-react';
import { hcomApi } from '../api/services';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
}

interface Message {
  id: string;
  sender: 'hermes' | 'claude';
  text: string;
  time: string;
}

const demoConversations: Conversation[] = [
  { id: '1', name: 'hermes → claude', lastMessage: 'Auth middleware done. JWT-based, 15min expiry.', unread: 0 },
  { id: '2', name: 'Group: Sprint Team', lastMessage: 'kimi: UI components ready for review', unread: 2 },
  { id: '3', name: 'hermes → kimi', lastMessage: 'Start on the dashboard layout after auth', unread: 0 },
];

const demoMessages: Message[] = [
  { id: 'm1', sender: 'hermes', text: 'Design the auth middleware for the platform. Use JWT with 15min expiry.', time: '2:30 PM' },
  { id: 'm2', sender: 'claude', text: 'Working on it. Should I use Fastify decorators or middleware hooks?', time: '2:32 PM' },
  { id: 'm3', sender: 'hermes', text: 'Middleware hooks. Keep it decoupled from route handlers.', time: '2:33 PM' },
  { id: 'm4', sender: 'claude', text: 'Auth middleware done. JWT-based, 15min expiry. RBAC checks role per route.', time: '2:45 PM' },
  { id: 'm5', sender: 'hermes', text: 'Excellent. Add refresh token endpoint too.', time: '2:46 PM' },
];

export function ChatPage() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const queryClient = useQueryClient();

  // Fetch agents from HCOM API
  const { data: agentsData } = useQuery({
    queryKey: ['hcom', 'agents'],
    queryFn: () => hcomApi.getAgents().then((r) => r as unknown[]),
    staleTime: 30_000,
  });

  // Map agents to conversations, fall back to demo
  const conversations: Conversation[] = agentsData && agentsData.length > 0
    ? (agentsData as Record<string, unknown>[]).map((agent, i) => ({
        id: String(agent.id ?? i),
        name: String(agent.name ?? `Agent ${i + 1}`),
        lastMessage: String(agent.status ?? ''),
        unread: 0,
      }))
    : demoConversations;

  // Fetch messages for the active conversation/agent
  const { data: messagesData } = useQuery({
    queryKey: ['hcom', 'messages', activeConversation],
    queryFn: () => hcomApi.getMessages(activeConversation).then((r) => r as unknown[]),
    staleTime: 10_000,
  });

  const messages: Message[] = messagesData && messagesData.length > 0
    ? (messagesData as Record<string, unknown>[]).map((msg, i) => ({
        id: String(msg.id ?? `msg-${i}`),
        sender: (msg.from === 'hermes' ? 'hermes' : 'claude') as 'hermes' | 'claude',
        text: String(msg.content ?? msg.text ?? ''),
        time: msg.timestamp ? new Date(String(msg.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      }))
    : demoMessages;

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: (text: string) =>
      hcomApi.sendMessage(activeConversation, { content: text, from: 'hermes' }).then((r) => r as unknown),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hcom', 'messages', activeConversation] });
      setInputValue('');
    },
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage.mutate(inputValue.trim());
  };

  return (
    <div className="flex h-full w-full bg-background text-foreground">
      {/* Left Panel — Conversation List */}
      <div className="w-1/4 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hover/30">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations…"
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors ${
                activeConversation === conv.id ? 'bg-hover/40' : 'hover:bg-hover/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{conv.name}</span>
                {conv.unread > 0 && (
                  <Badge variant="primary" pill>
                    {conv.unread}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate">{conv.lastMessage}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center — Message Thread */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">
            {conversations.find((c) => c.id === activeConversation)?.name}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages.map((msg) => {
            const isSent = msg.sender === 'hermes';
            return (
              <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-2 max-w-[70%]">
                  {!isSent && (
                    <div className="w-8 h-8 rounded-full bg-primary-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.sender[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isSent ? 'bg-primary-muted' : 'bg-hover/40'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block text-right">
                      {msg.time}
                    </span>
                  </div>
                  {isSent && (
                    <div className="w-8 h-8 rounded-full bg-primary-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.sender[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-hover/30 transition-colors text-muted-foreground">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            className="flex-1 bg-hover/20 rounded-lg px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Panel — Context */}
      <div className="w-1/4 border-l border-border flex flex-col p-4 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active Task
          </h3>
          <p className="text-sm font-medium">Implement auth system</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Linked Brain Pages
          </h3>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-primary underline cursor-pointer">Auth Architecture Plan</li>
            <li className="text-sm text-primary underline cursor-pointer">JWT Security Audit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
