<template>
  <div class="page-auth__container">
    <header class="page-auth__header">
      <img class="auth-header__logo" src="@/assets/images/girl.webp" />
      <van-password-input
        :value="secret"
        :gutter="12"
        :length="secretLength"
        :focused="keyboardVisible"
        :info="infoMsg"
        :error-info="errorMsg"
        @focus="showKeyboard"
      />
      <van-number-keyboard
        :value="secret"
        :show="keyboardVisible"
        @input="handleInputSecret"
        @delete="handleDeleteSecret"
        @blur="hideKeyboard"
      />
    </header>
    <footer class="page-auth__footer">
      <van-button type="primary" block :disabled="loginDisabled" @click="login">
        登录
      </van-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBoolean } from '@/hooks';
import { useAuthStore, LOGIN_SECRET } from '@/modules/auth';

defineOptions({
  name: 'Signin'
});

const router = useRouter();
const authStore = useAuthStore();
const secret = ref('');
const {
  state: keyboardVisible,
  setTrue: showKeyboard,
  setFalse: hideKeyboard
} = useBoolean();
const errorMsg = ref<string>();
const secretLength = 6;
const infoMsg = computed(() => (secret.value ? undefined : '请输入密码'));
const loginDisabled = computed(() => secret.value.length !== secretLength);

function handleInputSecret(num: number) {
  if (secret.value.length < secretLength) {
    secret.value = secret.value + String(num);
  }
}

function handleDeleteSecret() {
  if (secret.value.length > 0) {
    secret.value = secret.value.substring(0, secret.value.length - 1);
  }
}

function login() {
  if (secret.value === LOGIN_SECRET) {
    authStore.setToken('true');
    router.push('/');
  } else {
    errorMsg.value = '密码错误';
  }
}
</script>

<style scoped>
.page-auth__container {
  box-sizing: border-box;
  height: 100%;
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.page-auth__header {
  flex: 1;
  display: flex;
  gap: 48px;
  flex-direction: column;
}
.auth-header__logo {
  margin: 0 auto;
  width: 96px;
  height: 96px;
  border-radius: 12px;
}
.page-auth__footer {
  padding: 0 16px;
}
</style>
