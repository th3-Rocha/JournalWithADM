import { api } from '../api';

import { NewsResponseProps } from '../../types/newsTypes';
import { useRouter } from 'next/router';
import { DEFAULT_PAGINATED_NEWS } from '../../utils/placeholders';

export async function registerNews(data: FormData) {
  try {
    const response = await api.post<NewsResponseProps>('/news/register', data);
    
    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao criar notícia', IsTokenError: false } as any;
  }
}

export async function updateNews(
  id: string | undefined | string[],
  data: FormData
) {
  try {
    const response = await api.put<NewsResponseProps>(
      `/news/update/${id}`,
      data
    );

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao atualizar notícia', IsTokenError: false } as any;
  }
}

export async function addPostToGroup(
  id: string | undefined | string[],
  data: FormData
) {
  try {

    interface RequestBody {
      [key: string]: any;
    }
    const requestBody: RequestBody = {};
    data.forEach((value, key) => {
      requestBody[key] = value;
    });

    
    const response = await api.put<NewsResponseProps>(`/news/${id}/addpost`,requestBody);
    
    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao adicionar post no grupo', IsTokenError: false } as any;
  }
}

export async function updateNewsText(
  id: string | undefined | string[],
  data: string
) {
  try {
    const response = await api.patch<NewsResponseProps>(`/news/patch/${id}`, {
      text: data,
    });

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao atualizar texto da notícia', IsTokenError: false } as any;
  }
}

export async function deleteNews(id: string) {
  try {
    
    const response = await api.delete(`/news/delete/${id}`);
    return response;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao excluir notícia', IsTokenError: false } as any;
  }
}

export async function getOneNews(id: string | string[] | undefined) {
  try {
    const response = await api.get(`/news/get/${id}`);

    return response.data;
  } catch (error: any) {
    try {
      if (error?.response?.data) return error.response.data;
      if (error?.request?.response) return JSON.parse(error.request.response);
    } catch {}
    return { error: 'Falha ao buscar notícia', IsTokenError: false } as any;
  }
}

export async function getAllPaginatedNews(page = 1) {
  try {
    const response = await api.get(`/news/paginated-list?page=${page}`);
    
    return response.data;

    
  } catch (error: any) {
    return DEFAULT_PAGINATED_NEWS;
  }
}

export async function getAllPaginatedNewsOfGroup(id: string | string[] | undefined,page = 1){ //id Means ID of group
  try {
    const response = await api.get(`/news/group/${id}/paginated-list/?page=${page}`);
    
    return response.data;

  } catch (error: any) {
    return DEFAULT_PAGINATED_NEWS;
  }
}

