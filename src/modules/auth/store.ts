import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<string | null>('token', null);

  function setToken(value: string | null) {
    token.value = value;
  }

  return {
    token,
    setToken
  };
});
