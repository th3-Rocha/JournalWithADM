import { AboutResponseProps } from '../../types/aboutTypes';
import { api } from '../api';

export async function getAboutInfo() {
  try {

    const response = await api.get<AboutResponseProps>(`/about/get`);
    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
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
    return JSON.parse(error.request.response);
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
    return JSON.parse(error.request.response);
  }
}
