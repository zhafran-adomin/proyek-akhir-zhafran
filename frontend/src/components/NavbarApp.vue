<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['change-tab']);
</script>

<template>
  <header class="bg-blue-950 text-white shadow-md">
    <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="bg-emerald-500 text-blue-950 font-extrabold px-2.5 py-1 rounded text-sm">
          SMKN 5
        </span>
        <div>
          <h1 class="text-lg font-bold tracking-tight">SIM-EKSKUL TELKOM BANDA ACEH</h1>
          <p class="text-xs text-blue-200">Sistem Manajemen Ekstrakurikuler & Keanggotaan</p>
        </div>
      </div>

      <nav class="flex gap-2">
        <button
          @click="emit('change-tab', 'ekskul')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold transition',
            activeTab === 'ekskul'
              ? 'bg-emerald-500 text-blue-950 shadow'
              : 'bg-blue-900 text-blue-100 hover:bg-blue-800'
          ]"
        >
          Data Ekstrakurikuler
        </button>
        <button
          @click="emit('change-tab', 'anggota')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold transition',
            activeTab === 'anggota'
              ? 'bg-emerald-500 text-blue-950 shadow'
              : 'bg-blue-900 text-blue-100 hover:bg-blue-800'
          ]"
        >
          Keanggotaan Siswa
        </button>
      </nav>
    </div>
  </header>
</template>
