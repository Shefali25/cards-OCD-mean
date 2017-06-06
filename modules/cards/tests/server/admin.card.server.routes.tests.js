'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Card = mongoose.model('Card'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  card;

/**
 * Card routes tests
 */
describe('Card Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new card
    user.save(function () {
      card = {
        title: 'Card Title',
        content: 'Card Content'
      };

      done();
    });
  });

  it('should be able to save an card if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Get a list of cards
            agent.get('/api/cards')
              .end(function (cardsGetErr, cardsGetRes) {
                // Handle card save error
                if (cardsGetErr) {
                  return done(cardsGetErr);
                }

                // Get cards list
                var cards = cardsGetRes.body;

                // Set assertions
                (cards[0].user._id).should.equal(userId);
                (cards[0].title).should.match('Card Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Update card title
            card.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing card
            agent.put('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardUpdateErr, cardUpdateRes) {
                // Handle card update error
                if (cardUpdateErr) {
                  return done(cardUpdateErr);
                }

                // Set assertions
                (cardUpdateRes.body._id).should.equal(cardSaveRes.body._id);
                (cardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an card if no title is provided', function (done) {
    // Invalidate title field
    card.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(422)
          .end(function (cardSaveErr, cardSaveRes) {
            // Set message assertion
            (cardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle card save error
            done(cardSaveErr);
          });
      });
  });

  it('should be able to delete an card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Delete an existing card
            agent.delete('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardDeleteErr, cardDeleteRes) {
                // Handle card error error
                if (cardDeleteErr) {
                  return done(cardDeleteErr);
                }

                // Set assertions
                (cardDeleteRes.body._id).should.equal(cardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single card if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new card model instance
    card.user = user;
    var cardObj = new Card(card);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Get the card
            agent.get('/api/cards/' + cardSaveRes.body._id)
              .expect(200)
              .end(function (cardInfoErr, cardInfoRes) {
                // Handle card error
                if (cardInfoErr) {
                  return done(cardInfoErr);
                }

                // Set assertions
                (cardInfoRes.body._id).should.equal(cardSaveRes.body._id);
                (cardInfoRes.body.title).should.equal(card.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (cardInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Card.remove().exec(done);
    });
  });
});
