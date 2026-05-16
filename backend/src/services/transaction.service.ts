import pool from '../db';

export const getTransactionState = async () => {
  const sql = `
    SELECT owner_name, balance
    FROM accounts
    WHERE owner_name IN ('Alice', 'Bob')
    ORDER BY owner_name
  `;
  const accounts = await pool.query(sql);

  const countSql = `SELECT COUNT(*) AS count FROM transfer_logs`;
  const countResult = await pool.query(countSql);

  const alice = accounts.rows.find((r) => r.owner_name === 'Alice');
  const bob = accounts.rows.find((r) => r.owner_name === 'Bob');

  return {
    aliceBalance: alice ? Number(alice.balance) : null,
    bobBalance: bob ? Number(bob.balance) : null,
    transferLogCount: Number(countResult.rows[0].count),
  };
};

export const resetTransactionDemo = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`DELETE FROM transfer_logs`);

    // Upsert Alice
    await client.query(
      `INSERT INTO accounts (owner_name, balance)
       VALUES ('Alice', 10000000)
       ON CONFLICT (owner_name) DO UPDATE SET balance = 10000000`
    );

    // Upsert Bob
    await client.query(
      `INSERT INTO accounts (owner_name, balance)
       VALUES ('Bob', 2000000)
       ON CONFLICT (owner_name) DO UPDATE SET balance = 2000000`
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const transferSuccess = async (amount: number) => {
  const client = await pool.connect();
  const sql = `
-- Chuyển tiền thành công (ACID commit)
BEGIN;
  UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice';
  UPDATE accounts SET balance = balance + $1 WHERE owner_name = 'Bob';
  INSERT INTO transfer_logs (from_account, to_account, amount, status, note)
    SELECT a.id, b.id, $1, 'SUCCESS', 'Demo transfer'
    FROM accounts a, accounts b
    WHERE a.owner_name = 'Alice' AND b.owner_name = 'Bob';
COMMIT;`;
  try {
    await client.query('BEGIN');

    await client.query(`UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice'`, [amount]);
    await client.query(`UPDATE accounts SET balance = balance + $1 WHERE owner_name = 'Bob'`, [amount]);
    await client.query(
      `INSERT INTO transfer_logs (from_account, to_account, amount, status, note)
       SELECT a.id, b.id, $1, 'SUCCESS', 'Demo transfer'
       FROM accounts a, accounts b
       WHERE a.owner_name = 'Alice' AND b.owner_name = 'Bob'`,
      [amount]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  return sql.trim();
};

export const transferRollback = async (amount: number) => {
  const client = await pool.connect();
  const sql = `
-- Chuyển tiền thất bại (ROLLBACK do số dư không đủ)
BEGIN;
  UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice';
  -- Lỗi: balance check sẽ fail nếu Alice không đủ tiền
  -- Toàn bộ transaction bị ROLLBACK
ROLLBACK;`;
  try {
    await client.query('BEGIN');
    await client.query(`UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice'`, [amount]);
    // Force rollback by raising an error
    await client.query(`SELECT 1 / 0`);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    // This is expected — return the SQL for demo purposes
  } finally {
    client.release();
  }
  return sql.trim();
};
