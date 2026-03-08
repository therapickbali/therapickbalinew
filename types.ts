export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: 'massage' | 'body' | 'beauty' | 'packages';
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface ServiceRecommendation {
  serviceId: string;
  serviceName: string;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendation?: ServiceRecommendation;
}