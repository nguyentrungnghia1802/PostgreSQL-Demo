import pool from '../db';

export const getTransactionState = async () => {
  const accountsSql = `
    SELECT owner_name, balance
    FROM accounts
    WHERE owner_name IN ('Alice', 'Bob')
    ORDER BY owner_name
  `;
  const accounts = await pool.query(accountsSql);

  const countResult = await pool.query(`SELECT COUNT(*) AS count FROM transfer_logs`);

  const logResult = await pool.query(
    `SELECT id, amount, status, note, created_at FROM transfer_logs ORDER BY created_at DESC LIMIT 10`
  );

  const alice = accounts.rows.find((r: any) => r.owner_name === 'Alice');
  const bob = accounts.rows.find((r: any) => r.owner_name === 'Bob');

  return {
    aliceBalance: alice ? Number(alice.balance) : null,
    bobBalance: bob ? Number(bob.balance) : null,
    transferLogCount: Number(countResult.rows[0].count),
    logs: logResult.rows,
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

const TRANSFER_AMOUNT = 3_000_000;

export const transferSuccess = async () => {
  const beforeState = await getTransactionState();
  const amount = TRANSFER_AMOUNT;
  const client = await pool.connect();
  const displaySql = `BEGIN;

  -- Lock both rows to prevent concurrent modifications
  SELECT id, balance FROM accounts
  WHERE owner_name IN ('Alice', 'Bob')
  FOR UPDATE;

  -- Debit Alice
  UPDATE accounts
  SET balance = balance - ${amount}
  WHERE owner_name = 'Alice';

  -- Credit Bob
  UPDATE accounts
  SET balance = balance + ${amount}
  WHERE owner_name = 'Bob';

  -- Record transfer log
  INSERT INTO transfer_logs (from_account, to_account, amount, status, note)
    SELECT a.id, b.id, ${amount}, 'SUCCESS', 'Demo transfer'
    FROM accounts a, accounts b
    WHERE a.owner_name = 'Alice' AND b.owner_name = 'Bob';

COMMIT;`;

  try {
    await client.query('BEGIN');

    // FOR UPDATE row-level lock
    await client.query(
      `SELECT id, balance FROM accounts WHERE owner_name IN ('Alice', 'Bob') FOR UPDATE`
    );

    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice'`,
      [amount]
    );
    await client.query(
      `UPDATE accounts SET balance = balance + $1 WHERE owner_name = 'Bob'`,
      [amount]
    );
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

  const afterState = await getTransactionState();
  return { beforeState, afterState, sql: displaySql, transactionStatus: 'COMMITTED' as const };
};

export const transferFailure = async () => {
  const beforeState = await getTransactionState();
  const amount = TRANSFER_AMOUNT;
  const client = await pool.connect();
  const displaySql = `BEGIN;

  -- Lock both rows to prevent concurrent modifications
  SELECT id, balance FROM accounts
  WHERE owner_name IN ('Alice', 'Bob')
  FOR UPDATE;

  -- Debit Alice
  UPDATE accounts
  SET balance = balance - ${amount}
  WHERE owner_name = 'Alice';

  -- Simulated error mid-transaction:
  SELECT 1 / 0;  -- division by zero -> raises exception

  -- This INSERT will never execute
  INSERT INTO transfer_logs ...

ROLLBACK;  -- PostgreSQL automatically rolls back on error`;

  try {
    await client.query('BEGIN');

    await client.query(
      `SELECT id, balance FROM accounts WHERE owner_name IN ('Alice', 'Bob') FOR UPDATE`
    );

    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE owner_name = 'Alice'`,
      [amount]
    );

    // Simulate a mid-transaction failure
    await client.query(`SELECT 1 / 0`);

    await client.query('COMMIT');
  } catch {
    await client.query('ROLLBACK');
    // Expected failure — swallow the error
  } finally {
    client.release();
  }

  const afterState = await getTransactionState();
  return { beforeState, afterState, sql: displaySql, transactionStatus: 'ROLLED_BACK' as const };
};
