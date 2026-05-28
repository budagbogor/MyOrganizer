require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// ─── Health check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db: 'connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── Get user ───────────────────────────────────────────────
app.get('/api/user', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id LIMIT 1');
    if (result.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (name, role, initial, color, theme) VALUES ('User','Personal','U','gold','dark') RETURNING *`
      );
      return res.json(newUser.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Update user ────────────────────────────────────────────
app.put('/api/user', async (req, res) => {
  try {
    const { name, role, initial, color, theme, links } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1, role=$2, initial=$3, color=$4, theme=$5, links=$6, updated_at=NOW()
       WHERE id=(SELECT id FROM users ORDER BY id LIMIT 1) RETURNING *`,
      [name, role, initial, color, theme, JSON.stringify(links || {})]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Generic CRUD for all collections ───────────────────────
const TABLES = {
  work: { columns: ['title','priority','status','due','notes','tags'], idCol: 'id' },
  business: { columns: ['title','category','status','notes','progress'], idCol: 'id' },
  sales: { columns: ['title','company','contact','stage','value','probability','close_date','next_step','notes'], idCol: 'id' },
  family: { columns: ['name','role','relation','phone','email','birthday','notes'], idCol: 'id' },
  calendar: { columns: ['title','date','type','priority','reminder','notes'], idCol: 'id' },
  contacts: { columns: ['name','role','company','phone','email','tag','notes','last_contact'], idCol: 'id' },
  credentials: { columns: ['service','username','password_enc','password_iv','notes','category'], idCol: 'id' },
  data_items: { columns: ['title','value','category','notes'], idCol: 'id' },
  plans: { columns: ['title','phase','status','priority','details','milestones'], idCol: 'id' },
  notes: { columns: ['title','content','pinned','color'], idCol: 'id' },
};

// GET all items from a table
app.get('/api/:table', async (req, res) => {
  const table = req.params.table;
  if (!TABLES[table]) return res.status(404).json({ error: 'Table not found' });
  try {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE user_id=(SELECT id FROM users ORDER BY id LIMIT 1) ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create item
app.post('/api/:table', async (req, res) => {
  const table = req.params.table;
  if (!TABLES[table]) return res.status(404).json({ error: 'Table not found' });
  try {
    const cols = TABLES[table].columns;
    const userIdResult = await pool.query('SELECT id FROM users ORDER BY id LIMIT 1');
    const userId = userIdResult.rows[0].id;

    const values = cols.map(col => {
      let val = req.body[col];
      if (col === 'tags' || col === 'milestones') {
        return Array.isArray(val) ? val : [];
      }
      if (col === 'reminder' || col === 'pinned') {
        return val === true || val === 'true';
      }
      if (col === 'value' || col === 'probability' || col === 'progress') {
        return parseInt(val) || 0;
      }
      return val !== undefined ? val : '';
    });

    const placeholders = cols.map((_, i) => `$${i + 2}`).join(',');
    const colNames = ['user_id', ...cols].join(',');
    const allValues = [userId, ...values];

    const result = await pool.query(
      `INSERT INTO ${table} (${colNames}) VALUES ($1, ${placeholders}) RETURNING *`,
      allValues
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update item
app.put('/api/:table/:id', async (req, res) => {
  const table = req.params.table;
  const id = parseInt(req.params.id);
  if (!TABLES[table]) return res.status(404).json({ error: 'Table not found' });
  try {
    const cols = TABLES[table].columns;
    const setClauses = [];
    const values = [];
    let paramIdx = 1;

    for (const col of cols) {
      if (req.body[col] !== undefined) {
        let val = req.body[col];
        if (col === 'tags' || col === 'milestones') {
          val = Array.isArray(val) ? val : [];
        }
        if (col === 'reminder' || col === 'pinned') {
          val = val === true || val === 'true';
        }
        if (col === 'value' || col === 'probability' || col === 'progress') {
          val = parseInt(val) || 0;
        }
        setClauses.push(`${col}=$${paramIdx}`);
        values.push(val);
        paramIdx++;
      }
    }

    if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });

    setClauses.push(`updated_at=NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE ${table} SET ${setClauses.join(',')} WHERE id=$${paramIdx} RETURNING *`,
      values
    );
    res.json(result.rows[0] || { error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
app.delete('/api/:table/:id', async (req, res) => {
  const table = req.params.table;
  const id = parseInt(req.params.id);
  if (!TABLES[table]) return res.status(404).json({ error: 'Table not found' });
  try {
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Bulk sync: push all data at once ───────────────────────
app.post('/api/sync/push', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query('SELECT id FROM users ORDER BY id LIMIT 1');
    const userId = userResult.rows[0].id;

    // Update user if provided
    if (req.body.user) {
      const u = req.body.user;
      await client.query(
        `UPDATE users SET name=$1, role=$2, initial=$3, color=$4, theme=$5, links=$6, updated_at=NOW() WHERE id=$7`,
        [u.name||'', u.role||'', u.initial||'U', u.color||'gold', u.theme||'dark', JSON.stringify(u.links||{}), userId]
      );
    }

    // Sync each collection
    for (const [table, config] of Object.entries(TABLES)) {
      const dataKey = table === 'data_items' ? 'data' : table;
      const items = req.body[dataKey];
      if (!items || !Array.isArray(items)) continue;

      // Clear existing data for this user
      await client.query(`DELETE FROM ${table} WHERE user_id=$1`, [userId]);

      // Insert all items
      for (const item of items) {
        const values = config.columns.map(col => {
          // Map frontend field names to DB column names
          let val;
          if (col === 'password_enc') val = item.passwordEnc;
          else if (col === 'password_iv') val = item.passwordIv;
          else if (col === 'close_date') val = item.closeDate;
          else if (col === 'last_contact') val = item.lastContact;
          else val = item[col];

          if (col === 'tags' || col === 'milestones') return Array.isArray(val) ? val : [];
          if (col === 'reminder' || col === 'pinned') return val === true;
          if (col === 'value' || col === 'probability' || col === 'progress') return parseInt(val) || 0;
          return val !== undefined && val !== null ? val : '';
        });

        const placeholders = config.columns.map((_, i) => `$${i + 2}`).join(',');
        const colNames = ['user_id', ...config.columns].join(',');
        await client.query(
          `INSERT INTO ${table} (${colNames}) VALUES ($1, ${placeholders})`,
          [userId, ...values]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, synced_at: new Date().toISOString() });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── Bulk sync: pull all data ───────────────────────────────
app.get('/api/sync/pull', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT * FROM users ORDER BY id LIMIT 1');
    if (userResult.rows.length === 0) {
      return res.json({ user: null, data: {} });
    }
    const user = userResult.rows[0];
    const userId = user.id;

    const data = {};
    for (const [table] of Object.entries(TABLES)) {
      const result = await pool.query(
        `SELECT * FROM ${table} WHERE user_id=$1 ORDER BY id`, [userId]
      );
      // Map DB column names back to frontend field names
      const mapped = result.rows.map(row => {
        const item = { ...row };
        delete item.user_id;
        delete item.created_at;
        delete item.updated_at;
        // Map snake_case to camelCase for frontend
        if (item.password_enc !== undefined) { item.passwordEnc = item.password_enc; delete item.password_enc; }
        if (item.password_iv !== undefined) { item.passwordIv = item.password_iv; delete item.password_iv; }
        if (item.close_date !== undefined) { item.closeDate = item.close_date; delete item.close_date; }
        if (item.last_contact !== undefined) { item.lastContact = item.last_contact; delete item.last_contact; }
        return item;
      });
      const dataKey = table === 'data_items' ? 'data' : table;
      data[dataKey] = mapped;
    }

    res.json({
      user: {
        name: user.name,
        role: user.role,
        initial: user.initial,
        color: user.color,
        theme: user.theme,
        links: user.links || {}
      },
      ...data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Personal Hub API Server running on http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${__dirname}`);
  console.log(`🗄️  Database: NeonDB (PostgreSQL)`);
  console.log(`\n📌 Endpoints:`);
  console.log(`   GET  /api/health        - Health check`);
  console.log(`   GET  /api/user          - Get user profile`);
  console.log(`   PUT  /api/user          - Update user profile`);
  console.log(`   GET  /api/:table        - Get all items`);
  console.log(`   POST /api/:table        - Create item`);
  console.log(`   PUT  /api/:table/:id    - Update item`);
  console.log(`   DELETE /api/:table/:id  - Delete item`);
  console.log(`   POST /api/sync/push     - Push all data to DB`);
  console.log(`   GET  /api/sync/pull     - Pull all data from DB`);
  console.log(`\n🌐 Open http://localhost:${PORT} in your browser\n`);
});
