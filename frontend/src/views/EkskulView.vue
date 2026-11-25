<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const ekskulList = ref([]);
const pembinaList = ref([]);
const isLoading = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);
const errorMessage = ref('');

// State form sinkron 100% dengan nama kolom SQL tabel ekskul
const form = ref({
  id_ekskul: null,
  nama_ekskul: '',
  kategori: 'Teknologi',
  id_pembina: ''
});

const kategoriOptions = ['Teknologi', 'Olahraga', 'Seni', 'Kepemimpinan', 'Keagamaan'];

// Mengambil data ekskul dan daftar pembina dari API
const fetchInitialData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [resEkskul, resPembina] = await Promise.all([
      api.get('/ekskul'),
      api.get('/master/pembina')
    ]);
    ekskulList.value = resEkskul.data.data;
    pembinaList.value = resPembina.data.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Gagal mengambil data dari server.';
  } finally {
    isLoading.value = false;
  }
};

// Membuka modal untuk Tambah atau Edit
const openCreateModal = () => {
  isEditMode.value = false;
  form.value = {
    id_ekskul: null,
    nama_ekskul: '',
    kategori: 'Teknologi',
    id_pembina: pembinaList.value.length > 0 ? pembinaList.value[0].id_pembina : ''
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = {
    id_ekskul: item.id_ekskul,
    nama_ekskul: item.nama_ekskul,
    kategori: item.kategori,
    id_pembina: item.id_pembina
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Simpan data baru (POST) atau pembaruan data (PUT)
const saveEkskul = async () => {
  try {
    const payload = {
      nama_ekskul: form.value.nama_ekskul,
      kategori: form.value.kategori,
      id_pembina: form.value.id_pembina
    };

    if (isEditMode.value) {
      await api.put(`/ekskul/${form.value.id_ekskul}`, payload);
      alert('Data ekstrakurikuler berhasil diperbarui!');
    } else {
      await api.post('/ekskul', payload);
      alert('Data ekstrakurikuler baru berhasil ditambahkan!');
    }

    closeModal();
    await fetchInitialData();
  } catch (error) {
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
  }
};

// Hapus data (DELETE)
const removeEkskul = async (id, nama) => {
  const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus ekstrakurikuler "${nama}"?`);
  if (!konfirmasi) return;

  try {
    await api.delete(`/ekskul/${id}`);
    alert('Data ekstrakurikuler berhasil dihapus.');
    await fetchInitialData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus data.');
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Konten -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Daftar Ekstrakurikuler</h2>
        <p class="text-sm text-slate-500">Kelola data unit kegiatan siswa dan pembina penanggung jawab.</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition cursor-pointer"
      >
        + Tambah Ekskul
      </button>
    </div>

    <!-- Pesan Error -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
      {{ errorMessage }}
    </div>

    <!-- Tabel Data -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-slate-500 text-sm">
        Memuat data ekstrakurikuler...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-xs uppercase text-slate-600 font-bold">
              <th class="py-3.5 px-4">No</th>
              <th class="py-3.5 px-4">Nama Ekstrakurikuler</th>
              <th class="py-3.5 px-4">Kategori</th>
              <th class="py-3.5 px-4">Pembina</th>
              <th class="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-for="(item, index) in ekskulList" :key="item.id_ekskul" class="hover:bg-slate-50 transition">
              <td class="py-3.5 px-4 font-medium text-slate-500">{{ index + 1 }}</td>
              <td class="py-3.5 px-4 font-bold text-slate-800">{{ item.nama_ekskul }}</td>
              <td class="py-3.5 px-4">
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {{ item.kategori }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600">
                <div>{{ item.nama_pembina }}</div>
                <div class="text-xs text-slate-400">NIP: {{ item.nip }}</div>
              </td>
              <td class="py-3.5 px-4 text-center space-x-2">
                <button
                  @click="openEditModal(item)"
                  class="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold px-3 py-1.5 rounded text-xs transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  @click="removeEkskul(item.id_ekskul, item.nama_ekskul)"
                  class="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1.5 rounded text-xs transition cursor-pointer"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="ekskulList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">
                Belum ada data ekstrakurikuler tersimpan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah / Edit Ekskul -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-slate-800 mb-4">
          {{ isEditMode ? 'Edit Data Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru' }}
        </h3>

        <form @submit.prevent="saveEkskul" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Ekstrakurikuler</label>
            <input
              v-model="form.nama_ekskul"
              type="text"
              required
              placeholder="Contoh: Telkom Cyber Security"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Kategori</label>
            <select
              v-model="form.kategori"
              required
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option v-for="kat in kategoriOptions" :key="kat" :value="kat">
                {{ kat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Pembina</label>
            <select
              v-model="form.id_pembina"
              required
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option v-for="p in pembinaList" :key="p.id_pembina" :value="p.id_pembina">
                {{ p.nama_pembina }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
