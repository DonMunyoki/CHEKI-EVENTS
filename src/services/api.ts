const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-name.onrender.com/api'  // Replace with your actual Render URL
  : 'http://localhost:3001/api';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  image: string;
  ticketLink: string;
  availableTickets?: number;
}

export interface User {
  id: number;
  admission_number: string;
  name: string;
  email?: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  quantity: number;
  totalPrice: string;
  status: string;
  purchaseDate: string;
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    category?: string;
  };
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Authentication
  async login(admission_number: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admission_number, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async register(admission_number: string, name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admission_number, name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  // Events
  async getEvents(category?: string, search?: string): Promise<Event[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  }

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/events/categories/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  // Tickets
  async getMyTickets(): Promise<Ticket[]> {
    const response = await fetch(`${API_BASE_URL}/tickets/my-tickets`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  }

  async purchaseTickets(eventId: string, quantity: number): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ eventId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to purchase tickets');
    }

    const result = await response.json();
    return result.ticket;
  }

  async getTicket(id: string): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  }

  async cancelTicket(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel ticket');
    }
  }

  // User Profile
  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
