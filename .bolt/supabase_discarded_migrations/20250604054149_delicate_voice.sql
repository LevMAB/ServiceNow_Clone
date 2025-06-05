/*
  # Create test users

  1. New Data
    - Creates test users with different roles:
      - Admin user
      - Agent users
      - Regular users
    - Sets up roles for each user
    
  2. Security
    - Passwords are hashed using bcrypt
    - Users are created with appropriate role assignments
*/

DO $$
DECLARE
  admin_id uuid;
  agent1_id uuid;
  agent2_id uuid;
  user1_id uuid;
  user2_id uuid;
BEGIN
  -- Create admin user
  INSERT INTO users (email, password)
  VALUES ('admin@test.com', '$2a$10$xLVGkigNwU0ebP1XVOYzwekzPHM0.Jpe1Bx2vQKCHtTBHp5h6.VIS')
  RETURNING id INTO admin_id;

  -- Create agent users
  INSERT INTO users (email, password)
  VALUES ('agent1@test.com', '$2a$10$xLVGkigNwU0ebP1XVOYzwekzPHM0.Jpe1Bx2vQKCHtTBHp5h6.VIS')
  RETURNING id INTO agent1_id;

  INSERT INTO users (email, password)
  VALUES ('agent2@test.com', '$2a$10$xLVGkigNwU0ebP1XVOYzwekzPHM0.Jpe1Bx2vQKCHtTBHp5h6.VIS')
  RETURNING id INTO agent2_id;

  -- Create regular users
  INSERT INTO users (email, password)
  VALUES ('user1@test.com', '$2a$10$xLVGkigNwU0ebP1XVOYzwekzPHM0.Jpe1Bx2vQKCHtTBHp5h6.VIS')
  RETURNING id INTO user1_id;

  INSERT INTO users (email, password)
  VALUES ('user2@test.com', '$2a$10$xLVGkigNwU0ebP1XVOYzwekzPHM0.Jpe1Bx2vQKCHtTBHp5h6.VIS')
  RETURNING id INTO user2_id;

  -- Assign roles
  INSERT INTO roles (user_id, role) VALUES
    (admin_id, 'admin'),
    (agent1_id, 'agent'),
    (agent2_id, 'agent'),
    (user1_id, 'requester'),
    (user2_id, 'requester');
END $$;