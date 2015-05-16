'use strict';

var helmet = require('../');

var koa = require('koa');
var request = require('supertest');

describe('hsts', function() {
  var app;

  beforeEach(function() {
    app = koa();
  });

  it('sets header properly with no args', function(done) {
    app.use(helmet.hsts());
    app.use(function *() {
      this.body = 'Hello world!';
    });

    request(app.listen())
      .get('/')
      .set('x-forwarded-proto', 'https')
      .expect('Strict-Transport-Security', 'max-age=15768000', done);
  });

  it('sets header properly with includeSubdomains', function(done) {
    app.use(helmet.hsts('1234', true, false));
    app.use(function *() {
      this.body = 'Hello world!';
    });

    request(app.listen())
      .get('/')
      .set('x-forwarded-proto', 'https')
      .expect('Strict-Transport-Security', 'max-age=1234; includeSubdomains', done);
  });

  it('sets header properly with all args enabled', function(done) {
    app.use(helmet.hsts('1234', true, true));
    app.use(function *() {
      this.body = 'Hello world!';
    });

    request(app.listen())
      .get('/')
      .set('x-forwarded-proto', 'https')
      .expect('Strict-Transport-Security', 'max-age=1234; includeSubdomains; preload', done);
  });

});
