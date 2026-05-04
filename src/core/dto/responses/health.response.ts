import { TStatusValues } from '@/common/types';

export class HealthResponse {
  status!: TStatusValues;
  timestamp!: string;
}
