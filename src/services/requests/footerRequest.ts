import { api } from '../api';
import { FooterResponseProps } from './../../types/footerTypes';
import { DEFAULT_FOOTER } from '../../utils/placeholders';


export async function getInfoFooter() {
  try {
    const response = await api.get<FooterResponseProps>(`/footer/get`);

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return DEFAULT_FOOTER;
  }
}

export async function updateInfoFooter(data: FormData) {
  try {
    const response = await api.put<FooterResponseProps>(
      `/footer/update`,
      data
    );
    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao atualizar footer', IsTokenError: false } as any;
  }
}
