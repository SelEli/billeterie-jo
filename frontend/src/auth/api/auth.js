// src/auth/api/auth.js
import { apiFetch } from '../../common/utils/fetcher';

export const login = (data) => apiFetch('/auth/login', { method: 'POST', body: data });
export const register = (data) => apiFetch('/auth/register', { method: 'POST', body: data });
export const getProfile = () => apiFetch('/auth/profile');
export const updateProfile = (data) => apiFetch('/auth/profile', { method: 'PUT', body: data });
export const logout = () => apiFetch('/auth/logout', { method: 'POST' });
export const deleteProfile = () => apiFetch('/auth/profile', { method: 'DELETE' });
