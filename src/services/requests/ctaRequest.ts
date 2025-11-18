import { api } from '../api';
import { CTAResponse } from '../../types/CTATypes';

export async function registerCTA(data: FormData) {
  try {
    const response = await api.post<CTAResponse>('/cta/register', data);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function getAllCTAs(): Promise<CTAResponse> {
  try {
    const response = await api.get<CTAResponse>('/cta/list');

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function updateCTA(id: string | undefined, data: FormData) {
  try {
    const response = await api.put<CTAResponse>(`/cta/update/${id}`, data);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function deleteCTA(id: string): Promise<{ success: string }> {
  try {
    const response = await api.delete<{ success: string }>(`/cta/delete/${id}`);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}
