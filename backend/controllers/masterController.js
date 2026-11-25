import pool from '../config/db.js';

export const getAllPembina = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_pembina, nip, nama_pembina FROM pembina ORDER BY nama_pembina ASC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSiswa = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.nisn, s.nama_lengkap, s.kelas, j.kode_jurusan, j.nama_jurusan
      FROM siswa s
      INNER JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      ORDER BY s.nama_lengkap ASC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTahunAjaran = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_tahun_ajaran, nama_tahun, semester FROM tahun_ajaran ORDER BY id_tahun_ajaran DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
