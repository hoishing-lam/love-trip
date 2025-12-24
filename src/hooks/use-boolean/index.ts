import { ref } from 'vue';

export function useBoolean(initState = false) {
  const state = ref(initState);

  function setTrue() {
    state.value = true;
  }

  function setFalse() {
    state.value = false;
  }

  return {
    state,
    setTrue,
    setFalse
  };
}
