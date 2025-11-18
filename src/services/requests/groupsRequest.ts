import { api } from '../api';

import { GroupsResponseProps } from '../../types/groupsTypes';

export async function registerGroup(data: FormData) {
  try {   
    interface RequestBody {
      [key: string]: any;
    }
    const requestBody: RequestBody = {};
    data.forEach((value, key) => {
      requestBody[key] = value;
    });

    
    const response = await api.post<GroupsResponseProps>('/postgroups/register', requestBody);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function updateGroup(id: string | undefined | string[],data: FormData){
  try {
    interface RequestBody {
      [key: string]: any;
    }
    const requestBody: RequestBody = {};
    data.forEach((value, key) => {
      requestBody[key] = value;
    });
    const response = await api.put<GroupsResponseProps>(`/postgroups/update/${id}`,requestBody);

    return response.data;
  } catch (error: any) {
    
    return JSON.parse(error.request.response);
  }
}


export async function deleteGroup(id: string | undefined | string[]) {
  try {
    const response = await api.delete(`/postgroups/delete/${id}`);

    return response;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function getOneGroup(id: string | string[] | undefined) {
  try {
    const response = await api.get(`/postgroups/get/${id}`);

    return response.data;
  } catch (error: any) {
    return JSON.parse(error.request.response);
  }
}

export async function getAllPaginatedGroup(page = 1) {
  try {
    const response = await api.get(`/postgroups/paginated-list?page=${page}`);

    return response.data;
  } catch (error: any) {
    return "Erro ao listar Grupos";
  }
}
