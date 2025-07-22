-- Allow authenticated users to insert files
CREATE POLICY "Allow insert for authenticated users" ON files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
