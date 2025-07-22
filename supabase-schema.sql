-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Files table
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  name text NOT NULL,
  description text,
  encrypted_data text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  avatar text,
  text text NOT NULL,
  time timestamp with time zone DEFAULT now(),
  sent boolean DEFAULT true,
  reply_to uuid REFERENCES chat_messages(id)
);

-- Activity logs table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  text text NOT NULL,
  time timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for users table (allow users to select their own data)
CREATE POLICY "Users can select their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Similar policies should be created for other tables as needed.
