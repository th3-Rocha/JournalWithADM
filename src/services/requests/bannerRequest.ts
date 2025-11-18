import { api } from '../api';

import { BannerResponseProps } from '../../types/bannerTypes';

export async function registerBanner(data: FormData) {
  try {
    const response = await api.post<BannerResponseProps>(
      '/banner/register',
      data
    );

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function updateBanner(id: string | undefined, data: FormData) {
  try {
    const response = await api.put<BannerResponseProps>(
      `/banner/update/${id}`,
      data
    );

    return response.data;
  } catch (error: any) {
    
    return JSON.parse(error.request.response);
  }
}

export async function deleteBanner(id: string) {
  try {
    const response = await api.delete(`/banner/delete/${id}`);

    return response;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}
