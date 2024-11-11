<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();
const route = useRoute();

// Form fields
const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const role = ref('');
const loading = ref(false);

// Validation and feedback
const passwordStrengthMessage = ref('');
const passwordStrengthClass = ref('');
const passwordConfirmTouched = ref(false); // Tracks if the confirm password field was interacted with
const emailTouched = ref(false); // Tracks if the email field was interacted with

// Computed properties for validation
const emailIsValid = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.value);
});
const showEmailError = computed(() => !emailIsValid.value && emailTouched.value);
const passwordsMatch = computed(() => password.value === passwordConfirm.value);
const showPasswordMatchError = computed(() => !passwordsMatch.value && passwordConfirmTouched.value);
const formValid = computed(() => {
  return (
    username.value &&
    emailIsValid.value &&
    password.value &&
    passwordConfirm.value &&
    role.value &&
    passwordsMatch.value &&
    isPasswordOk()
  );
});

// Methods
const checkPasswordStrength = () => {
  const pwd = password.value;
  if (pwd.length < 6) {
    passwordStrengthMessage.value = "Password is too short";
    passwordStrengthClass.value = "text-red-600";
  } else if (pwd.length < 8) {
    passwordStrengthMessage.value = "Weak password";
    passwordStrengthClass.value = "text-yellow-600";
  } else if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[@$!%*?&#]/.test(pwd)) {
    passwordStrengthMessage.value = "Strong password";
    passwordStrengthClass.value = "text-green-600";
  } else {
    passwordStrengthMessage.value = "Medium strength";
    passwordStrengthClass.value = "text-blue-600";
  }
};

const isPasswordOk = () => {
  return (
    password.value.length >= 6 
  );
};

// Register function
const register = async () => {
  if (!formValid.value) {
    console.error("Form is not valid");
    return;
  }

  loading.value = true;
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    console.error(error.message);
  } else {
    router.push('/');
  }
};

// Track when the user interacts with the password confirmation field
const onPasswordConfirmFocus = () => {
  passwordConfirmTouched.value = true;
};

// Track when the user interacts with the email field
const onEmailFocus = () => {
  emailTouched.value = true;
};
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/logo_indigo.png" class="w-16 h-16">
        <span class="ml-4 text-2xl font-semibold text-gray-700">Synapse</span>
      </div>

      <form class="mt-4" @submit.prevent="register">
        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input v-model="username" type="text"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-4">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="email" type="email" @focus="onEmailFocus"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <span v-if="showEmailError" class="text-sm text-red-600">Invalid email format</span>
        </label>

        <label class="block mt-4">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="password" type="password" @input="checkPasswordStrength"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <span class="text-sm" :class="passwordStrengthClass">{{ passwordStrengthMessage }}</span>
        </label>

        <label class="block mt-4">
          <span class="text-sm text-gray-700">Confirm Password</span>
          <input v-model="passwordConfirm" type="password" @focus="onPasswordConfirmFocus"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <span v-if="showPasswordMatchError" class="text-sm text-red-600">Passwords do not match</span>
        </label>

        <label class="block mt-4">
          <span class="text-sm text-gray-700">Are you a student or teacher?</span>
          <select v-model="role"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
            <option value="" disabled>Select your role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <button type="submit" :disabled="!formValid"
          class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 disabled:bg-gray-400">
          Register
        </button>
      </form>




    </div>
  </div>
</template>