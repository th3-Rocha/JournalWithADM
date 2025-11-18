import { api } from '../api';

import { NewsResponseProps } from '../../types/newsTypes';
import { useRouter } from 'next/router';

export async function registerNews(data: FormData) {
  try {
    const response = await api.post<NewsResponseProps>('/news/register', data);
    
    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
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
    
    return JSON.parse(error.request.response);
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
    
    return JSON.parse(error.request.response);
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
    return JSON.parse(error.request.response);
  }
}

export async function deleteNews(id: string) {
  try {
    
    const response = await api.delete(`/news/delete/${id}`);
    return response;
  } catch (error: any) {

    return JSON.parse(error.request.response);
  }
}

export async function getOneNews(id: string | string[] | undefined) {
  try {
    const response = await api.get(`/news/get/${id}`);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function getAllPaginatedNews(page = 1) {
  try {
    const response = await api.get(`/news/paginated-list?page=${page}`);
    
    return response.data;

    
  } catch (error: any) {
    return "Erro ao listar notícias";
  }
}

export async function getAllPaginatedNewsOfGroup(id: string | string[] | undefined,page = 1){ //id Means ID of group
  try {
    const response = await api.get(`/news/group/${id}/paginated-list/?page=${page}`);
    
    return response.data;

  } catch (error: any) {
    return "Erro ao listar notícias";
  }
}

