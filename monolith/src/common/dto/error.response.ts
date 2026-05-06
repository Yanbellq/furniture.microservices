export class ErrorResponse {
  statusCode!: number;
  timestamp!: string;
  path!: string;
  error!: {
    statusCode: number;
    message: string | string[];
    error: string;
  };
}
