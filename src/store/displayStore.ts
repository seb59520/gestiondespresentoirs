import { atom } from 'jotai';
import type { Display, DisplayReservation, DisplayUsage, DisplayRequest } from '../types';

// Get displays from domain
const getDomainDisplays = (): Display[] => {
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  return domain.displays || [];
};

// Atoms for display state
export const displaysAtom = atom<Display[]>(getDomainDisplays());

export const updateDisplayAtom = atom(
  null,
  (get, set, update: Partial<Display> & { id: string }) => {
    const displays = get(displaysAtom);
    const updatedDisplays = displays.map(display => 
      display.id === update.id ? { ...display, ...update } : display
    );
    set(displaysAtom, updatedDisplays);
    
    // Update localStorage
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    domain.displays = updatedDisplays;
    localStorage.setItem('domain', JSON.stringify(domain));
  }
);

// Handle reservations
export const createReservationAtom = atom(
  null,
  (get, set, reservation: Partial<DisplayReservation> & { displayId: string }) => {
    const displays = get(displaysAtom);
    const display = displays.find(d => d.id === reservation.displayId);
    
    if (!display) return;

    const updatedDisplay: Display = {
      ...display,
      status: 'reserved',
      currentReservation: {
        id: `reservation-${Date.now()}`,
        userId: 'current-user',
        status: 'active',
        ...reservation
      } as DisplayReservation
    };

    set(updateDisplayAtom, updatedDisplay);
  }
);

// Handle reservation cancellation
export const cancelReservationAtom = atom(
  null,
  (get, set, displayId: string) => {
    const displays = get(displaysAtom);
    const display = displays.find(d => d.id === displayId);
    
    if (!display || !display.currentReservation) return;

    const updatedDisplay: Display = {
      ...display,
      status: 'available',
      currentReservation: {
        ...display.currentReservation,
        status: 'cancelled'
      }
    };

    set(updateDisplayAtom, updatedDisplay);
  }
);

// Handle usage reports
export const addUsageReportAtom = atom(
  null,
  (get, set, usage: Partial<DisplayUsage> & { displayId: string }) => {
    const displays = get(displaysAtom);
    const display = displays.find(d => d.id === usage.displayId);
    
    if (!display) return;

    const usageReport: DisplayUsage = {
      id: `usage-${Date.now()}`,
      ...usage,
      date: usage.date || new Date().toISOString()
    } as DisplayUsage;

    const updatedDisplay: Display = {
      ...display,
      usageHistory: [...(display.usageHistory || []), usageReport]
    };

    set(updateDisplayAtom, updatedDisplay);
  }
);

// Handle display requests
export const createDisplayRequestAtom = atom(
  null,
  (get, set, request: Partial<DisplayRequest> & { displayId: string }) => {
    const displays = get(displaysAtom);
    const display = displays.find(d => d.id === request.displayId);
    
    if (!display) return;

    const newRequest: DisplayRequest = {
      id: `request-${Date.now()}`,
      ...request,
      status: 'pending',
      createdAt: request.createdAt || new Date().toISOString()
    } as DisplayRequest;

    const updatedDisplay: Display = {
      ...display,
      requests: [...(display.requests || []), newRequest]
    };

    set(updateDisplayAtom, updatedDisplay);
  }
);

// Handle request updates
export const updateRequestStatusAtom = atom(
  null,
  (get, set, update: { displayId: string; requestId: string; status: DisplayRequest['status'] }) => {
    const displays = get(displaysAtom);
    const display = displays.find(d => d.id === update.displayId);
    
    if (!display || !display.requests) return;

    const updatedDisplay: Display = {
      ...display,
      requests: display.requests.map(request =>
        request.id === update.requestId
          ? { ...request, status: update.status }
          : request
      )
    };

    set(updateDisplayAtom, updatedDisplay);
  }
);