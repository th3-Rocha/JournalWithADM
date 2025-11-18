import { AboutResponseProps } from '../../types/aboutTypes';
import { DEFAULT_ABOUT } from '../../utils/placeholders';
import { api } from '../api';

export async function getAboutInfo() {
  try {

    const response = await api.get<AboutResponseProps>(`/about/get`);
    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return DEFAULT_ABOUT;
  }
}

export async function updateInfoAbout(data: FormData) {
  try {
    const response = await api.put<AboutResponseProps>(
      `/about/update`,
      data
    );

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao atualizar sobre', IsTokenError: false } as any;
  }
}

export async function updateDescriptionAbout(data: string) {
  try {
    const response = await api.patch<AboutResponseProps>(
      `/about/update-text`,
      { text: data }
    );

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao atualizar texto do sobre', IsTokenError: false } as any;
  }
}
