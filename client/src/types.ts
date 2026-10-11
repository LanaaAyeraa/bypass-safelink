export interface Hop {
  url: string;
  status: number;
  redirectUrl?: string;
  type?: string;
}

export interface BypassResult {
  success: boolean;
  originalUrl: string;
  destinationUrl: string;
  domain: string;
  method: string;
  hops: Hop[];
  totalHops: number;
  durationMs: number;
  error?: string;
  timestamp?: number;
}
