const { client } = require('../db');
/*
    `CREATE TABLE IF NOT EXISTS "languages" (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
    )
    */
class Language {

  static async createLanguage (name, description) {
    try {
      const query = {
        text: ` INSERT INTO languages(name, description) VALUES($1, $2) RETURNING *
        `,
        values: [name, description]
      }
      const res = await client.query(query);
      // console.log(res);
      if (res.rows) {
        return {
          data: res.rows[0],
          success: true
        }
      } else {
        return {
          sucess: false
        }
      }
    } catch (err){
      // console.log(err);
      return { err: (err ), success: false };
    }
  }
  static async getAllLanguages () {
    try {
      const query = {
        text: `
          SELECT * FROM languages ORDER BY name
        `,
      }
      const res = await client.query(query);
      // console.log(res?.rows);
      return {
        data: res.rows,
        success: true
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
  static async getLanguageById (id) {
    try {
      const query = {
        text: `
          SELECT * FROM languages WHERE id = $1
        `,
        values: [id]
      }
      const res = await client.query(query);
      // console.log(res?.rows[0]);
      return {
        data: res.rows[0],
        success: true
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
  static async updateLanguage (id, name, description) {
    try {
      console.log(description)
      const query = {
        text: `
          UPDATE languages SET name = $1, description = $2 WHERE id = $3
        `,
        values: [name, description, id]
      }
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }

  static async deleteLanguageById(id) {
    try {
      const query = {
        text: `
          DELETE FROM languages WHERE id = $1
        `,
        values: [id]
      }
      // console.log(storyId);
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
}

module.exports = {
  Language,
}