<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const anggotaList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const tahunAjaranList = ref([]);
const isLoading = ref(false);

const form = ref({
  nisn: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const jabatanOptions = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Anggota'];

const loadAllData = async () => {
  isLoading.value = true;
  try {
    const [resAnggota, resSiswa, resEkskul, resTahun] = await Promise.all([
      api.get('/anggota'),
      api.get('/master/siswa'),
      api.get('/ekskul'),
      api.get('/master/tahun-ajaran')
    ]);

    anggotaList.value = resAnggota.data.data;
    siswaList.value = resSiswa.data.data;
    ekskulList.value = resEkskul.data.data;
    tahunAjaranList.value = resTahun.data.data;

    if (siswaList.value.length > 0 && !form.value.nisn) {
      form.value.nisn = siswaList.value[0].nisn;
    }
    if (ekskulList.value.length > 0 && !form.value.id_ekskul) {
      form.value.id_ekskul = ekskulList.value[0].id_ekskul;
    }
    if (tahunAjaranList.value.length > 0 && !form.value.id_tahun_ajaran) {
      form.value.id_tahun_ajaran = tahunAjaranList.value[0].id_tahun_ajaran;
    }
  } catch (error) {
    alert('Gagal memuat data keanggotaan: ' + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
};

const registerAnggota = async () => {
  try {
    await api.post('/anggota', form.value);
    alert('Siswa berhasil didaftarkan ke ekstrakurikuler!');
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mendaftarkan anggota.');
  }
};

const removeAnggota = async (id, namaSiswa) => {
  if (!confirm(`Keluarkan "${namaSiswa}" dari keanggotaan ekskul ini?`)) return;
  try {
    await api.delete(`/anggota/${id}`);
    alert('Data keanggotaan berhasil dihapus.');
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus keanggotaan.');
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Kolom Kiri: Form Pendaftaran Anggota -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
      <h2 class="text-lg font-bold text-slate-800 mb-1">Pendaftaran Anggota</h2>
      <p class="text-xs text-slate-500 mb-4">Hubungkan data siswa ke ekstrakurikuler aktif.</p>

      <form @submit.prevent="registerAnggota" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Pilih Siswa</label>
          <select
            v-model="form.nisn"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
              {{ s.nama_lengkap }} ({{ s.kelas }} - {{ s.kode_jurusan }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ekstrakurikuler</label>
          <select
            v-model="form.id_ekskul"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
              {{ e.nama_ekskul }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tahun Ajaran</label>
          <select
            v-model="form.id_tahun_ajaran"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option v-for="t in tahunAjaranList" :key="t.id_tahun_ajaran" :value="t.id_tahun_ajaran">
              {{ t.nama_tahun }} ({{ t.semester }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Jabatan</label>
          <select
            v-model="form.jabatan"
            required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option v-for="jab in jabatanOptions" :key="jab" :value="jab">
              {{ jab }}
            </option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm transition cursor-pointer"
        >
          Daftarkan Anggota
        </button>
      </form>
    </div>

    <!-- Kolom Kanan: Tabel Daftar Anggota -->
    <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-200">
        <h2 class="text-lg font-bold text-slate-800">Daftar Anggota Ekstrakurikuler</h2>
        <p class="text-xs text-slate-500">Data hasil relasi tabel siswa, jurusan, ekskul, dan tahun ajaran.</p>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-slate-500 text-sm">
        Memuat data keanggotaan...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-xs uppercase text-slate-600 font-bold">
              <th class="py-3 px-4">Siswa</th>
              <th class="py-3 px-4">Ekstrakurikuler</th>
              <th class="py-3 px-4">Periode</th>
              <th class="py-3 px-4">Jabatan</th>
              <th class="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-for="item in anggotaList" :key="item.id_anggota" class="hover:bg-slate-50">
              <td class="py-3 px-4">
                <div class="font-bold text-slate-800">{{ item.nama_lengkap }}</div>
                <div class="text-xs text-slate-500">{{ item.nisn }} • {{ item.kelas }} ({{ item.kode_jurusan }})</div>
              </td>
              <td class="py-3 px-4 font-semibold text-blue-900">{{ item.nama_ekskul }}</td>
              <td class="py-3 px-4 text-xs text-slate-600">{{ item.nama_tahun }} - {{ item.semester }}</td>
              <td class="py-3 px-4">
                <span class="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {{ item.jabatan }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="removeAnggota(item.id_anggota, item.nama_lengkap)"
                  class="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-2.5 py-1 rounded text-xs transition cursor-pointer"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="anggotaList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">Belum ada anggota terdaftar.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
