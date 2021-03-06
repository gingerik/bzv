'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var moment = require('moment');

var Candidate = require('../../lib/model/candidate');
var Peasant = require('../../lib/model/peasant');
var Period = require('../../lib/model/period');
var User = require('../../lib/model/user');
var Vote = require('../../lib/model/vote');

describe('Candidate Model', () => {

  var myPeasant;

  before(() => {
    var peasant = {
      year: 2000,
      name: 'Peasant'
    };
    return Peasant.create(peasant)
      .then((peasant) => {
        expect(peasant._id).to.be.ok;
        myPeasant = peasant;
      });
  });

  it('should create a Candidate', () => {
    var candidate = {
      name: 'Foo',
      peasant: myPeasant._id
    };
    return Candidate.create(candidate)
      .then((candidate) => {
        expect(candidate.name).to.equal('Foo');
        expect(candidate.peasant).to.equal(myPeasant._id);
        expect(candidate.updated).to.be.a('Date');
      });
  });

  it('should create another Candidate', () => {
    var candidate = {
      name: 'Bar',
      peasant: myPeasant._id
    };
    return Candidate.create(candidate)
      .then((candidate) => {
        expect(candidate.name).to.equal('Bar');
        expect(candidate.peasant).to.equal(myPeasant._id);
        expect(candidate.updated).to.be.a('Date');
      });
  });

  it('should have Candidates', () => {
    return Candidate.find()
      .then((candidates) => {
        expect(candidates.length).to.equal(2);
      });
  });

  it('should edit a Candidate', () => {
    return Candidate.findOne()
      .then((candidate) => {
        candidate.year = 1999;
        candidate.name = 'Candidate';
        return candidate.save();
      })
      .then((candidate) => {
        expect(candidate.year).to.equal(1999);
        expect(candidate.name).to.equal('Candidate');
        expect(candidate.updated).to.be.a('Date');
      });
  });

  it('should delete all Candidates', () => {
    return Candidate.remove();
  });

  it('should not have Candidates', () => {
    return Candidate.find()
      .then((candidates) => {
        expect(candidates.length).to.equal(0);
      });
  });

  describe('should cleanup nicely', () => {

    var candidateA;
    var candidateB;
    var peasant;
    var period;
    var user;

    before(() => {
      var year = 2000;
      return Peasant.remove()
        .then(() => {
          return Peasant.create({
            year: year,
            name: 'Peasant'
          });
        })
        .then((res) => {
          peasant = res;
          return Promise.all([
            Candidate.create({
              name: 'CandidateA',
              peasant: peasant._id
            }),
            Candidate.create({
              name: 'CandidateB',
              peasant: peasant._id
            })
          ]);
        })
        .then((values) => {
          candidateA = values.shift();
          candidateB = values.shift();
          return Period.create({
            year: year,
            start: moment().subtract(1, 'day'),
            end: moment().add(1, 'day'),
            numberOfVotes: 1
          });
        })
        .then((res) => {
          period = res;
          return User.create({
            year: year,
            name: 'User',
            email: 'user@bzv.js',
            hash: 'password',
          });
        })
        .then((res) => {
          user = res;
          return Promise.all([
            Vote.create({
              candidate: candidateA._id,
              period: period._id,
              user: user._id,
              type: 'love'
            }),
            Vote.create({
              candidate: candidateB._id,
              period: period._id,
              user: user._id,
              type: 'bad'
            })
          ]);
        })
        .then((values) => {
          return Promise.all([
            Peasant.find(),
            Candidate.find(),
            Period.find(),
            User.find({role: 'user'}),
            Vote.find()
          ]);
        })
        .then((values) => {
          expect(values[0].length).to.equal(1);
          expect(values[1].length).to.equal(2);
          expect(values[2].length).to.equal(1);
          expect(values[3].length).to.equal(1);
          expect(values[4].length).to.equal(2);
        })
        .then(() => {
          return Promise.all([
            candidateA.remove(),
            candidateB.remove()
          ]);
        });
    });

    it('should remove Candidates', () => {
      return Candidate.find()
        .then((candidates) => {
          expect(candidates.length).to.equal(0);
        });
    });

    it('should remove Votes', () => {
      return Vote.find()
        .then((votes) => {
          expect(votes.length).to.equal(0);
        });
    });

    after(() => {
      return Promise.all([
        Peasant.remove(),
        Period.remove(),
        User.remove()
      ]);
    });

  });

  describe('should have functionally correct methods', () => {

    var candidates = [];
    var periods = [];

    before(() => {
      return Promise.all([
        Peasant.create({
          year: 2000,
          name: 'Peasant'
        }),
        Period.create({
          year: 2000,
          start: moment().subtract(4, 'weeks'),
          end: moment().subtract(3, 'weeks'),
          reference: moment().subtract(1, 'week'),
          numberOfVotes: 1
        }),
        Period.create({
          year: 2000,
          start: moment().subtract(4, 'weeks'),
          end: moment().subtract(3, 'weeks'),
          reference: moment().add(1, 'week'),
          numberOfVotes: 1
        })
      ])
      .then((values) => {
        var peasant = values.shift();
        periods = values;
        return Promise.all([
          Candidate.create({
            name: 'CandidateA',
            peasant: peasant._id
          }),
          Candidate.create({
            name: 'CandidateB',
            peasant: peasant._id,
            dropped: moment().subtract(2, 'week')
          }),
          Candidate.create({
            name: 'CandidateC',
            peasant: peasant._id,
            dropped: moment()
          })
        ]);
      })
      .then((values) => {
        candidates = values;
        expect(periods.length).to.equal(2);
        expect(candidates.length).to.equal(3);
      });
    });

    it('isDropped', () => {
      expect(candidates[0].isDropped()).to.be.false;
      expect(candidates[0].isDropped(periods[0])).to.be.false;
      expect(candidates[0].isDropped(periods[1])).to.be.false;
      expect(candidates[1].isDropped()).to.be.true;
      expect(candidates[1].isDropped(periods[0])).to.be.true;
      expect(candidates[1].isDropped(periods[1])).to.be.true;
      expect(candidates[2].isDropped()).to.be.true;
      expect(candidates[2].isDropped(periods[0])).to.be.false;
      expect(candidates[2].isDropped(periods[1])).to.be.true;
    });

    it('isWinner', () => {
      return Promise.all([
        candidates[0].isWinner(),
        candidates[1].isWinner(),
        candidates[2].isWinner()
      ])
      .then((values) => {
        expect(values[0]).to.be.true;
        expect(values[1]).to.be.false;
        expect(values[2]).to.be.false;
      });
    });

    after(() => {
      return Promise.all([
        Peasant.remove(),
        Period.remove(),
        Candidate.remove()
      ]);
    });

  });

});
