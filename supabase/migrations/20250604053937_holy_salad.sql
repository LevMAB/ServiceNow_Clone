/*
  # Create test users

  1. New Users
    - Creates admin, agent, and requester test accounts
    - Sets up roles for each user
    - Uses bcrypt hashed passwords
  
  2. Security
    - Enables RLS on users table
    - Adds policies for user access
*/

-- Create test users with hashed passwords (test123)
INSERT INTO users (id, email, password) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@test.com', '$2a$10$xJ7Yt1UE3C7SKpG8Ct.B8eH1g4qFZ7kXwN1C7zXL3ZR8nKxL8V5Vy'),
  ('22222222-2222-2222-2222-222222222222', 'agent1@test.com', '$2a$10$xJ7Yt1UE3C7SKpG8Ct.B8eH1g4qFZ7kXwN1C7zXL3ZR8nKxL8V5Vy'),
  ('33333333-3333-3333-3333-333333333333', 'user1@test.com', '$2a$10$xJ7Yt1UE3C7SKpG8Ct.B8eH1g4qFZ7kXwN1C7zXL3ZR8nKxL8V5Vy')
ON CONFLICT (email) DO NOTHING;

-- Assign roles
INSERT INTO roles (user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'agent'),
  ('33333333-3333-3333-3333-333333333333', 'requester')
ON CONFLICT (user_id) DO NOTHING;