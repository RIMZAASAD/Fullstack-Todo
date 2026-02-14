import { apiClient } from './api-client';

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/change-password', {
    current_password: data.current_password,
    new_password: data.new_password
  });
  return response.data as { message: string };
};