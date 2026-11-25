import pool from '../config/db.js';

// GET: Mengambil seluruh data ekskul beserta nama pembina
export const getAllEkskul = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id_ekskul, e.nama_ekskul, e.kategori, e.id_pembina, p.nama_pembina, p.nip
      FROM ekskul e
      INNER JOIN pembina p ON e.id_pembina = p.id_pembina
      ORDER BY e.id_ekskul DESC
    `);
    res.status(200).json({
      success: true,
      message: 'Data ekstrakurikuler berhasil diambil',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID: Mengambil satu data ekskul berdasarkan id_ekskul
export const getEkskulById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT e.id_ekskul, e.nama_ekskul, e.kategori, e.id_pembina, p.nama_pembina
      FROM ekskul e
      INNER JOIN pembina p ON e.id_pembina = p.id_pembina
      WHERE e.id_ekskul = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data ekskul tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST: Menambahkan data ekskul baru
export const createEkskul = async (req, res) => {
  try {
    const { nama_ekskul, kategori, id_pembina } = req.body;

    if (!nama_ekskul || !kategori || !id_pembina) {
      return res.status(400).json({
        success: false,
        message: 'Field nama_ekskul, kategori, dan id_pembina wajib diisi'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO ekskul (nama_ekskul, kategori, id_pembina) VALUES (?, ?, ?)',
      [nama_ekskul, kategori, id_pembina]
    );

    res.status(201).json({
      success: true,
      message: 'Data ekstrakurikuler berhasil ditambahkan',
      data: {
        id_ekskul: result.insertId,
        nama_ekskul,
        kategori,
        id_pembina
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Memperbarui data ekskul berdasarkan id_ekskul
export const updateEkskul = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_ekskul, kategori, id_pembina } = req.body;

    if (!nama_ekskul || !kategori || !id_pembina) {
      return res.status(400).json({
        success: false,
        message: 'Field nama_ekskul, kategori, dan id_pembina wajib diisi'
      });
    }

    const [result] = await pool.query(
      'UPDATE ekskul SET nama_ekskul = ?, kategori = ?, id_pembina = ? WHERE id_ekskul = ?',
      [nama_ekskul, kategori, id_pembina, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data ekskul tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Data ekstrakurikuler berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE: Menghapus data ekskul berdasarkan id_ekskul
export const deleteEkskul = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM ekskul WHERE id_ekskul = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data ekskul tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Data ekstrakurikuler berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
