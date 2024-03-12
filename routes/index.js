const expressGraphQL = require('express-graphql').graphqlHTTP;
const ConceptController = require('../controllers/ConceptController');
const LanguageController = require('../controllers/LanguageController');
const UserController = require('../controllers/UserController');
const Session = require('../middleware/Session');

module.exports = (server) => {
  server.route('/api/language/create-language')
    .post(LanguageController.postLanguage);
  server.route('/api/language/all-languages')
    .get(LanguageController.getAllLanguages);
  server.route('/api/language/by-id/:id')
    .get(LanguageController.getLanguageById);
  // server.use('/api/language/by-id/:id', expressGraphQL({
  //   schema: LanguageController.getLanguageById,
  //   graphiql: true,
  // }))
  server.route('/api/language/update')
    .put(LanguageController.updateLanguage);
  server.route('/api/language/delete-id/:id')
    .delete(LanguageController.deleteLanguageById);

  // post, delete, updated (put) and delete  topics
  server.route('/api/concept/create-topic')
    .post(ConceptController.postConceptTopic);
  server.route('/api/concept/all-topics')
    .get(ConceptController.getAllTopics);
  server.route('/api/concept/topic-object/:id')
    .get(ConceptController.getTopicById);
  server.route('/api/concept/update-topic')
    .put(ConceptController.updateTopic);
  server.route('/api/concept/delete-topic/:id')
    .delete(ConceptController.deleteTopic);



    // delete lanaugae conept entry. For example, functions in javascript is a concept. We delete the concept of functions in javascript, not the language 'JavaScript' or the topic of functions itself
  server.route('/api/concept/create-entry')
    .post(ConceptController.postConceptforLanguageEntry);
  server.route('/api/concept/update-entry')
    .put(ConceptController.updateConceptForLanguageEntry);
  server.route('/api/concept/all-entries')
    .get(ConceptController.getAllConceptEntries);
  server.route('/api/concept/by-language')
    .post(ConceptController.getConceptsByLanguage);
  server.route('/api/concept/concept-only')
    .post(ConceptController.consceptsOnly);
  server.route('/api/concept/topic-id/:topicId')
    .get(ConceptController.getConceptsByTopicId);
  server.route('/api/concept/delete-concept-entry/:id')
    .delete(ConceptController.deleteConceptEntryById);


  server.route('/api/users/register-user')
    .post(UserController.registerUser)
  server.route('/api/users/login-user')
    .post(UserController.loginUser)
  server.route('/api/users/logout-user')
    .get(Session.checkSession, UserController.logoutUser)
  server.route('/api/users/get-user-session')
    .get(Session.checkSession, UserController.getUserSession)
  server.route('/api/users/change-password')
    .put(UserController.changePassword);
  server.route('/api/users/get')
    .get(UserController.getUsers);

  // graphQL versions of routes
  server.use('/api/concept/all-test-topics', expressGraphQL({
    schema: ConceptController.getAllTopics,
    graphiql: true,
  }))

};