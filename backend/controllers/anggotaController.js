import pool from '../config/db.js';

// GET: Mengambil seluruh data keanggotaan ekskul lengkap dengan relasi 5 tabel
export const getAllAnggota = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id_anggota,
        a.nisn,
        s.nama_lengkap,
        s.kelas,
        j.kode_jurusan,
        a.id_ekskul,
        e.nama_ekskul,
        a.id_tahun_ajaran,
        t.nama_tahun,
        t.semester,
        a.jabatan
      FROM anggota_ekskul a
      INNER JOIN siswa s ON a.nisn = s.nisn
      INNER JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      INNER JOIN ekskul e ON a.id_ekskul = e.id_ekskul
      INNER JOIN tahun_ajaran t ON a.id_tahun_ajaran = t.id_tahun_ajaran
      ORDER BY a.id_anggota DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST: Mendaftarkan siswa ke dalam ekstrakurikuler
export const createAnggota = async (req, res) => {
  try {
    const { nisn, id_ekskul, id_tahun_ajaran, jabatan } = req.body;

    if (!nisn || !id_ekskul || !id_tahun_ajaran) {
      return res.status(400).json({
        success: false,
        message: 'Field nisn, id_ekskul, dan id_tahun_ajaran wajib diisi'
      });
    }

    // Cek duplikasi keanggotaan pada ekskul & tahun ajaran yang sama
    const [duplicate] = await pool.query(
      'SELECT id_anggota FROM anggota_ekskul WHERE nisn = ? AND id_ekskul = ? AND id_tahun_ajaran = ?',
      [nisn, id_ekskul, id_tahun_ajaran]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Siswa tersebut sudah terdaftar pada ekstrakurikuler dan tahun ajaran ini'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO anggota_ekskul (nisn, id_ekskul, id_tahun_ajaran, jabatan) VALUES (?, ?, ?, ?)',
      [nisn, id_ekskul, id_tahun_ajaran, jabatan || 'Anggota']
    );

    res.status(201).json({
      success: true,
      message: 'Anggota ekskul berhasil didaftarkan',
      data: { id_anggota: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Mengubah jabatan atau status ekskul anggota
export const updateAnggota = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_ekskul, id_tahun_ajaran, jabatan } = req.body;

    const [result] = await pool.query(
      'UPDATE anggota_ekskul SET id_ekskul = ?, id_tahun_ajaran = ?, jabatan = ? WHERE id_anggota = ?',
      [id_ekskul, id_tahun_ajaran, jabatan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data anggota tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Data keanggotaan berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE: Menghapus keanggotaan siswa dari ekskul
export const deleteAnggota = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM anggota_ekskul WHERE id_anggota = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data anggota tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Data keanggotaan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
