const { client } = require('../db');
/*
  CREATE TABLE IF NOT EXISTS "concept_topics" (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  )
*/


class ConceptTopic{
  static async createConceptTopic (name, description) {
    try {
      const query = {
        text: ` INSERT INTO concept_topics(name, description) VALUES($1, $2) RETURNING *
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
      console.log(err);
      return { err: (err ), success: false };
    }
  }

  static async getTopicById (id) {
    try {
      const query = {
        text: `
          SELECT * FROM concept_topics WHERE id = $1
        `,
        values: [id]
      }
      const res = await client.query(query);
      console.log(res?.rows[0]);
      return {
        data: res.rows[0],
        success: true
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
  static async getAllTopics () {
    try {
      const query = {
        text: `
          SELECT * FROM concept_topics ORDER BY category ASC, rank ASC
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

  static async updateTopic (name, description, id, rank, category) {
    try {
      console.log(typeof(rank))
      const query = {
        text: `
          UPDATE concept_topics SET name = $1, description = $2, rank = $3, category = $4 WHERE id = $5
        `,
        values: [name, description, rank, category, id]
      }
      await client.query(query);

      console.log('reached 3')
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }

  static async deleteTopicById(id) {
    try {
      const query = {
        text: `
          DELETE FROM concept_topics WHERE id = $1
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
  ConceptTopic
}