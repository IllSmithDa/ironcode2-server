const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString} = require('graphql');
const { ConceptItem } = require("../models/ConceptItem");
const { ConceptTopic } = require("../models/ConceptTopics");


// all concept topics
const postConceptTopic = async (req, res) => {
  const {name, description} = req.body;

  try {
    const response = await ConceptTopic.createConceptTopic(name, description);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}

const getTopicById = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
    const response = await ConceptTopic.getTopicById(id);
    console.log(response);
    if (response.success) {
      // console.log('jeo')
      // console.log(response.data);
      res.status(200).json({ success: true, data: response.data  })
    } else {
      res.status(400).json({ success: false , err: response.err })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

// const getAllTopics = async (req, res) => {
//   try {
//     const response = await ConceptTopic.getAllTopics();
//     if (response.success) {
//       res.status(200).json({ success: true, data: response.data  })
//     }
//   } catch (err) {
//     res.status(401).json({ err: (err ).message })
//   }
// }
/*
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      description TEXT,
      rank INTEGER DEFAULT 1,
      category VARCHAR(100) DEFAULT 'basic',
      created_at
      */

const TopicType = new GraphQLObjectType({
  name: 'Topic',
  description: 'Concept topic',
  fields: (() => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString)},
    description: {type: GraphQLString},
    rank: {type: GraphQLNonNull(GraphQLInt)},
    category: { type: GraphQLNonNull(GraphQLString)},
    created_at: {type: GraphQLNonNull(GraphQLString)}
  }))
})
    
const getAllTopics = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'GetAllTopics',
    description: 'All Concept topics query',
    fields: () => ({
      topics: {
        type: new GraphQLList(TopicType),
        description: 'list of all concept topics',
        resolve: async () => await ConceptTopic.getAllTopics()
      }
    })
  })
})

const updateTopic = async (req, res) => {
  try {
    const {name, description, topicId, rank, category} = req.body;
    // console.log(rank)
    const response = await ConceptTopic.updateTopic(name, description, topicId, Number(rank), category);
    if (response.success) {
      res.status(200).json({ success: true})
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}
const deleteTopic = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await ConceptTopic.deleteTopicById(id);
    if (response.success) {
      res.status(200).json({ success: true})
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}


// concept items routes 


const postConceptItem = async (req, res) => {
  const {conceptId, conceptName, text, language} = req.body;

  try {
    const response = await ConceptItem.createConcept(conceptId, conceptName, text, language);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}

const updateConceptItem = async (req, res) => {
  const {id, concept_id, concept_name, text, language} = req.body;
  try {
    const response = await ConceptItem.upodateConcept(id, concept_id, concept_name, text, language);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}

const getAllConceptItems = async (req, res) => {
  try {
    const response = await ConceptItem.getAllConceptItems();
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

const getConceptsByLanguage = async (req, res) => {
  const {language} = req.body;
  try {
    const response = await ConceptItem.getConceptsByLanguage(language);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}

const consceptsOnly = async (req, res) => {
  const {language} = req.body;
  try {
    const response = await ConceptItem.getConsceptsOnly(language);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}

const getConceptsByTopicId = async (req, res) => {
  const {topicId} = req.params;
  try {
    const response = await ConceptItem.getConceptsByTopicId(topicId);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err).message })
  }
}


const deleteConceptById = async (req, res) => {
  const {id} = req.params;
  try {
    const response = await ConceptItem.deleteConceptById(id);
    if (response.success) {
      res.status(200).json({ success: true })
    }
  } catch (err) {t
    res.status(401).json({ err: (err).message })
  }
}

module.exports = {
  postConceptTopic,
  getTopicById,
  getAllTopics,
  updateTopic,
  deleteTopic,
  postConceptItem,
  updateConceptItem,
  getAllConceptItems,
  getConceptsByLanguage,
  getConceptsByTopicId,
  deleteConceptById,
  consceptsOnly
}