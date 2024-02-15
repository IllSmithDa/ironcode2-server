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
  server.route('/api/language/update')
    .put(LanguageController.updateLanguage);
  server.route('/api/language/delete-id/:id')
    .delete(LanguageController.deleteLanguageById);

   
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


  server.route('/api/concept/create-item')
    .post(ConceptController.postConceptItem);
  server.route('/api/concept/update-item')
    .put(ConceptController.updateConceptItem);
  server.route('/api/concept/all-items')
    .get(ConceptController.getAllConceptItems);
  server.route('/api/concept/by-language')
    .post(ConceptController.getConceptsByLanguage);
  server.route('/api/concept/concept-only')
    .post(ConceptController.consceptsOnly);
  server.route('/api/concept/topic-id/:topicId')
    .get(ConceptController.getConceptsByTopicId);
  server.route('/api/concept/delete-id/:id')
    .delete(ConceptController.deleteConceptById);


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

};