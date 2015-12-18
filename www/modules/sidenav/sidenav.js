'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    header = require('../header/header'),
    User = require('../profile/user.model'),
    $ = require('jQuery'),
    Router = require('../routing/router'),
    Session = require('../main/session.model');

var View = Marionette.LayoutView.extend({
  template: require('./sidenav.html'),
  className: 'sidenav',
  events: {
    'click': 'hide',
    'click .btn-logout': 'onLogoutClick',
    'click .btn-profile': 'navigateToProfile',
    'click .btn-connexion': 'navigateToConnexion'
  },

  initialize: function() {
    var self = this;

    self.listenTo(header.getInstance(), 'btn:menu:click', self.toggleShow);
  },

  serializeData: function() {
    var user = User.model.getInstance();

    return {
      linkregister: (user.get('externId') ? '#profile/' + user.get('externId') : '#profile')
    };
  },

  onRender: function(options) {
    var self = this;

    //self.$el.i18n();
  },

  toggleShow: function() {
    $('body').toggleClass('show-sidenav');
  },

  show: function() {
    $('body').addClass('show-sidenav');
  },

  hide: function() {
    $('body').removeClass('show-sidenav');
  },

  onLogoutClick: function() {
    var Main = require('../main/main.view.js');

    Main.getInstance().showLoader();
    Session.model.getInstance().logout().always(function() {
      Main.getInstance().hideLoader();
    });
  },

  navigateToProfile: function() {
    Router.getInstance().navigate('#profile', {
      trigger: true
    });
  },

  navigateToConnexion: function() {
    Router.getInstance().navigate('#login', {
      trigger: true
    });
  }

});

var instance = null;

module.exports = {
  getInstance: function() {
    if (!instance)
        instance = new View();
    return instance;
  }
};
