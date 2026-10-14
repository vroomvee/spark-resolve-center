import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoTickets, type Ticket } from '@/lib/thump/data';
const DemoContext = createContext<{ tickets: Ticket[]; addTicket: (ticket: Ticket) => void; clearDemo: () => void }>({ tickets: demoTickets, addTicket: () => {}, clearDemo: () => {} });
export function DemoProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(demoTickets);
  return <DemoContext.Provider value={{ tickets, addTicket: ticket => setTickets(current => [ticket, ...current]), clearDemo: () => setTickets(demoTickets) }}>{children}</DemoContext.Provider>;
}
export const useDemo = () => useContext(DemoContext);