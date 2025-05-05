CREATE TABLE IF NOT EXISTS ea_clients (
  id SERIAL PRIMARY KEY,
  account_number TEXT UNIQUE NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  name TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  
CREATE TABLE IF NOT EXISTS signals (
  id SERIAL,
  signal_id TEXT NOT NULL PRIMARY KEY,
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
  signal_id TEXT REFERENCES signals(signal_id),
  account_number TEXT,
  license_key TEXT,
  result TEXT,
  notes TEXT,
  execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_reports (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  date DATE NOT NULL,
  trades_count INT NOT NULL,
  total_profit REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signal_acknowledgements (
  id SERIAL PRIMARY KEY,
  signal_id TEXT NOT NULL REFERENCES signals(signal_id),
  account_number TEXT NOT NULL,
  license_key TEXT NOT NULL,
  acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);