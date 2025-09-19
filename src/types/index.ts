// types/index.ts
export interface QueryParams {
  days?: number;
  hours?: number;
  date?: string;
}

export interface SuccessResponse {
  date: string; // ISO 8601 UTC con sufijo Z
}

export interface ErrorResponse {
  error: 'InvalidParameters' | 'InternalError';
  message: string;
}
