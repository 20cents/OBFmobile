'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('lodash'),
    User = require('../profile/user.model');

var ClassDef = Marionette.LayoutView.extend({
  header: {
    titleKey: 'dashboard',
    buttons: {
      left: ['menu']
    }
  },
  template: require('./dashboard.tpl.html'),
  className: 'page dashboard ns-full-height',
  events: {
    'click .header': 'onHeaderClick'
  },

  curTab: null,
  tabs: {
    missions: {
      ClassDef: require('./dashboard_missions.view')
    },
    logs: {
      ClassDef: require('./dashboard_logs.view')
    },
    observations: {
      ClassDef: require('./dashboard_observations.view')
    },
  },

  regions: {
    tabContent: '.tab-content'
  },

  initialize: function(options) {
    var self = this;

    self.defaultTab = _.keys(self.tabs)[0];
    self.curTab = options.tab || self.defaultTab;

    console.log('dashboard initialize');
  },

  serializeData: function() {
    var self = this;

    console.log(User.model.getInstance().toJSON());

    return {
      user: User.model.getInstance().toJSON(),
      tabs: self.tabs
    };
  },

  onRender: function(options) {
    var self = this;

    console.log('dashboard onRender');

    self.displayTab();
  },

  onHeaderClick: function() {
    var self = this;

    self.$el.find('.header').toggleClass('show-score-explode');
  },

  setTab: function(tab) {
    var self = this;

    console.log('dashboard setTab');

    tab = tab || self.defaultTab;
    if (tab == self.curTab)
    return false;

    self.curTab = tab;
    self.displayTab();
  },

  displayTab: function() {
    var self = this;

    var tab = self.tabs[self.curTab];
    var tabView = new tab.ClassDef();
    self.showChildView('tabContent', tabView);

    var $tabs = self.$el.find('.nav-tabs .tab');
    $tabs.removeClass('active');
    $tabs.filter('.tab-' + self.curTab).addClass('active');
  }
});

module.exports = ClassDef;
