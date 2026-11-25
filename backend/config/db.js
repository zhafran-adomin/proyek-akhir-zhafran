import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verifikasi koneksi database saat server dijalankan
pool.getConnection()
  .then((connection) => {
    console.log('Berhasil terhubung ke database MySQL:', process.env.DB_NAME);
    connection.release();
  })
  .catch((err) => {
    console.error('Gagal terhubung ke database MySQL:', err.message);
  });

export default pool;
