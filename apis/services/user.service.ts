import { urls } from "../urls";
import { httpClient } from "../client";

interface UserInfo {
  username: string;
}

interface Product {
  id?: number;
  name?: string;
  price?: number;
  imageURL?: string;
  colors?: string;
  sizes?: string;
  brand?: string;
}

interface Brand {
  name: string;
}

interface SearchParams {
  page: number;
  limit: number;
  brands?: string | null;
  search?: string | null;
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await httpClient().get(urls.user);
  return response.data;
}

export async function getProducts(
  page: number,
  brands: string | null = null
): Promise<any> {
  const params: SearchParams = { page, limit: 10 };
  if (brands) {
    params.brands = brands;
  }
  const response = await httpClient().get(urls.sneaker, { params });
  return response.data;
}

export async function getBrands(): Promise<[]> {
  const response = await httpClient().get(urls.brands);
  return response.data;
}

export async function searchFunc(
  page: number = 1,
  search: string | null = null
): Promise<any> {
  const params: SearchParams = { page, limit: 10 };
  if (search) {
    params.search = search;
  }
  const response = await httpClient().get(urls.sneaker, { params });
  return response.data;
}

export async function getSneaker(id: number): Promise<Product> {
  const response = await httpClient().get(urls.item(id));
  return response.data;
}
