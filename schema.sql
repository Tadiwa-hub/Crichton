-- Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  check_in TEXT NOT NULL, -- Format: YYYY-MM-DD
  check_out TEXT NOT NULL, -- Format: YYYY-MM-DD
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  location TEXT,
  guests_count INTEGER DEFAULT 1,
  source TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed'
);

-- Initial Room Data
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Sanyati', 'SANYATI ~ Executive Ensuite');
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Pungwe', 'PUNGWE ~ Standard Ensuite');
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Odzi', 'ODZI ~ Shared Bathroom');
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Gwayi', 'GWAYI ~ Shared Bathroom');
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Self Catering', 'SELF CATERING ~ Garden Cottage');
INSERT OR IGNORE INTO rooms (id, name) VALUES ('Full House', 'FULL HOUSE ~ All Four Rooms');
