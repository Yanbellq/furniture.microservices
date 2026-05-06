import { TStatusValues } from '@/common/types';

export class HealthResponse {
  status!: TStatusValues;
  uptime!: number;
  timestamp!: string;
}
