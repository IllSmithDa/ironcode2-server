require('dotenv').config();
const { Client } = require('pg');

let client = new Client((process.env.DATABASE_URL));
 
const connectClient = async () => {
  client = new Client((process.env.DATABASE_URL));
  await client.connect();


  // await client.query(
  //   `DROP TABLE iF EXISTS concept_items`
  // )
  // await client.query(
  //   `DROP TABLE iF EXISTS concept_topics`
  // )

  // await client.query(
  //   `DROP TABLE iF EXISTS languages`
  // )
  // await client.query(
  //   `DROP TABLE users CASCADE`
  // )
  // await client.query(
  //   `DROP TABLE user_sessions CASCADE`
  // )
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY, 
      username VARCHAR ( 255 ) UNIQUE NOT NULL,
      password VARCHAR ( 255 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      isadmin BOOLEAN DEFAULT FALSE,
      imageUrl VARCHAR (1000),
      strikes INTEGER DEFAULT 0,
      isbanned BOOLEAN DEFAULT FALSE
    )
  `)
  await client.query(`
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      sid varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      PRIMARY KEY (sid)
    )`
  )
  await client.query(
    `
    CREATE TABLE IF NOT EXISTS "languages" (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      description TEXT,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
    )
    `
  )
  await client.query(
    `
    CREATE TABLE IF NOT EXISTS "concept_topics" (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      description TEXT,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
    )
    `
  )
  await client.query(
    `
    CREATE TABLE IF NOT EXISTS "concept_items" (
      id BIGSERIAL PRIMARY KEY,
      concept_id BIGSERIAL REFERENCES concept_topics(id) ON DELETE CASCADE ON UPDATE CASCADE,
      concept_name VARCHAR(100) REFERENCES concept_topics(name) ON DELETE CASCADE ON UPDATE CASCADE,
      text TEXT,
      language VARCHAR(100) REFERENCES languages(name) ON DELETE CASCADE ON UPDATE CASCADE,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
    )
    `
  )
}

module.exports = {
  client,
  connectClient,
}
