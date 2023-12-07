const { client } = require('../db');
/*
  CREATE TABLE IF NOT EXISTS "concept_topics" (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  )
*/
/*
  CREATE TABLE IF NOT EXISTS "concept_items" (
    id BIGSERIAL PRIMARY KEY,
    concept_id BIGSERIAL REFERENCES concept_topics(id) ON DELETE CASCADE,
    concept_name VARCHAR(100) REFERENCES concept_topics(name) ON DELETE CASCADE,
    text TEXT,
    language VARCHAR(100) REFERENCES languages(name) ON DELETE CASCADE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  )
*/

class ConceptItem {

  static async createConcept (conceptId, conceptName, text, language) {
    try {
      // console.log(text);
      const query = {
        text: ` INSERT INTO concept_items(concept_id, concept_name, text, language) VALUES($1, $2, $3, $4) RETURNING *
        `,
        values: [conceptId, conceptName, text, language]
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
  static async upodateConcept(id, concept_id, concept_name, text, language) {
    try {
      // console.log(typeof(description))
      const query = {
        text: `
          UPDATE concept_items SET text = $1, concept_id = $2, concept_name = $3, language = $4 WHERE id = $5
        `,
        values: [text, concept_id, concept_name, language, id]
      }
      await client.query(query);

      console.log('reached 3')
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
  static async getAllConceptItems () {
    try {
      const query = {
        text: `
          SELECT * FROM concept_items
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
  static async getConceptsByLanguage (language) {
    try {
      const query = {
        text: `SELECT * FROM concept_items WHERE language = $1  ORDER BY language`,
        values: [language]
      }
      const res = await client.query(query);
      return {
        data: res.rows,
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }
  static async getConceptsByTopicId (conceptId) {
    try {
      const query = {
        text: `SELECT * FROM concept_items WHERE concept_id = $1 ORDER BY language`,
        values: [conceptId]
      }
      const res = await client.query(query);
      return {
        data: res.rows,
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }

  static async deleteConceptById(id) {
    try {
      const query = {
        text: `
          DELETE FROM concept_items WHERE id = $1
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
  ConceptItem
}