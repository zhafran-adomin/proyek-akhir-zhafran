<script setup>
import { ref } from 'vue';
import NavbarApp from './components/NavbarApp.vue';
import EkskulView from './views/EkskulView.vue';
import AnggotaView from './views/AnggotaView.vue';

const activeTab = ref('ekskul');
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 font-sans">
    <NavbarApp :active-tab="activeTab" @change-tab="(tab) => (activeTab = tab)" />

    <main class="max-w-6xl mx-auto px-4 py-8">
      <EkskulView v-if="activeTab === 'ekskul'" />
      <AnggotaView v-else-if="activeTab === 'anggota'" />
    </main>
  </div>
</template>
