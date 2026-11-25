import express from 'express';
import {
  getAllEkskul,
  getEkskulById,
  createEkskul,
  updateEkskul,
  deleteEkskul
} from '../controllers/ekskulController.js';
import {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota
} from '../controllers/anggotaController.js';
import {
  getAllPembina,
  getAllSiswa,
  getAllTahunAjaran
} from '../controllers/masterController.js';

const router = express.Router();

// Endpoint Data Master
router.get('/master/pembina', getAllPembina);
router.get('/master/siswa', getAllSiswa);
router.get('/master/tahun-ajaran', getAllTahunAjaran);

// Endpoint CRUD Ekskul
router.get('/ekskul', getAllEkskul);
router.get('/ekskul/:id', getEkskulById);
router.post('/ekskul', createEkskul);
router.put('/ekskul/:id', updateEkskul);
router.delete('/ekskul/:id', deleteEkskul);

// Endpoint CRUD Anggota Ekskul
router.get('/anggota', getAllAnggota);
router.post('/anggota', createAnggota);
router.put('/anggota/:id', updateAnggota);
router.delete('/anggota/:id', deleteAnggota);

export default router;
