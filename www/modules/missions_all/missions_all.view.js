'use strict';
var Marionette = require('backbone.marionette'),
    Header = require('../header/header'),
    Router = require('../main/router');

module.exports = Marionette.LayoutView.extend({
	header: {
		buttons: {
			right: ['option']
		}
	},
    template: require('./missions_all.tpl.html'),
    className: 'page page-missions page-missions-all page-scrollable',
    events: {},

    serializeData: function() {
        var self = this;

        return {
            missions: self.collection.toJSON()
        };
    },

    initialize: function() {
        var self = this;

        self.listenTo(Header.getInstance(), 'btn:option:click', function(e) {
            Router.getInstance().navigate('missions/all/filter', {
                trigger: true
            });
        });
    },

    onShow: function() {
        var self = this;
    },

    onDestroy: function() {
        var self = this;
    }
});