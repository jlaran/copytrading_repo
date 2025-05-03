CREATE TABLE IF NOT EXISTS ea_clients (
  id SERIAL PRIMARY KEY,
  account_number TEXT UNIQUE NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  name TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  
CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL,
  lot REAL NOT NULL,
  entry_price REAL NOT NULL,
  tp1 REAL,
  tp2 REAL,
  sl REAL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS executions (
  id SERIAL PRIMARY KEY,
  signal_id INT REFERENCES signals(id),
  account_number TEXT,
  api_key TEXT,
  result TEXT,
  notes TEXT,
  execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);