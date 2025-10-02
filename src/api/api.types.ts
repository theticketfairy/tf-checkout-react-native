// API response wrapper type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error: boolean;
  message: string;
  status: number;
}
