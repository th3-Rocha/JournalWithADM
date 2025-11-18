import { AxiosError } from 'axios';
import { api } from '../api';
import { FooterResponseProps } from './../../types/footerTypes';


export async function getInfoFooter() {
  try {
    const response = await api.get<FooterResponseProps>(`/footer/get`);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
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
   
  
    return JSON.parse(error.request.response);
  }
}
