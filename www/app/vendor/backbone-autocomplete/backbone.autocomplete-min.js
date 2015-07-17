var AutoCompleteItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template('<a href="#"><%= label %></a>'),
    events: {
        click: "select"
    },
    initialize: function(a) {
        this.options = a
    },
    render: function() {
        this.$el.html(this.template({
            label: this.highlight(this.model.label())
        }));
        return this
    },
    highlight: function(a) {
        var b = this.options.parent;
        if (a && b.highlight && b.currentText) {
            a = a.replace(new RegExp(this.escapeRegExp(b.currentText), "gi"), function(c) {
                return '<b class="' + b.highlight + '">' + c + "</b>"
            })
        }
        return a
    },
    escapeRegExp: function(a) {
        return String(a).replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")
    },
    select: function() {
        this.options.parent.hide().select(this.model);
        return false
    }
});
var AutoCompleteView = Backbone.View.extend({
    tagName: "ul",
    className: "autocomplete",
    wait: 300,
    queryParameter: "query",
    minKeywordLength: 2,
    currentText: "",
    itemView: AutoCompleteItemView,
    highlight: "",
    initialize: function(a) {
        _.extend(this, a);
        this.filter = _.debounce(this.filter, this.wait)
    },
    render: function() {
        this.input.attr("autocomplete", "off");
        this.$el.width(this.input.outerWidth());
        this.input.keyup(_.bind(this.keyup, this)).keydown(_.bind(this.keydown, this)).after(this.$el);
        return this
    },
    keydown: function(a) {
        if (a.keyCode == 38) {
            return this.move(-1)
        }
        if (a.keyCode == 40) {
            return this.move(+1)
        }
        if (a.keyCode == 13) {
            return this.onEnter()
        }
        if (a.keyCode == 27) {
            return this.hide()
        }
    },
    keyup: function() {
        var a = this.input.val();
        if (this.isChanged(a)) {
            if (this.isValid(a)) {
                this.filter(a)
            } else {
                this.hide()
            }
            this.currentText = a
        }
    },
    filter: function(a) {
        var a = a.toLowerCase();
        if (this.model.url) {
            var b = {};
            b[this.queryParameter] = a;
            this.model.fetch({
                success: _.bind(function() {
                    this.loadResult(this.model.models, a)
                }, this),
                data: b,
                cache: (typeof this.model.cache != "undefined") ? this.model.cache : undefined,
                dataType: (this.model.datatype) ? this.model.datatype : undefined,
                jsonpCallback: (this.model.callback) ? this.model.callback : undefined
            })
        } else {
            this.loadResult(this.model.filter(function(c) {
                return c.label().toLowerCase().indexOf(a) !== -1
            }), a)
        }
    },
    isValid: function(a) {
        return a.length >= this.minKeywordLength
    },
    isChanged: function(a) {
        return this.currentText != a
    },
    move: function(a) {
        var c = this.$el.children(".active"),
            d = this.$el.children(),
            b = c.index() + a;
        if (d.eq(b).length) {
            c.removeClass("active");
            d.eq(b).addClass("active")
        }
        return false
    },
    onEnter: function() {
        this.$el.children(".active").click();
        return false
    },
    loadResult: function(b, a) {
        this.show().reset();
        if (b.length) {
            _.forEach(b, this.addItem, this);
            this.show()
        } else {
            this.hide()
        }
    },
    addItem: function(a) {
        this.$el.append(new this.itemView({
            model: a,
            parent: this
        }).render().$el)
    },
    select: function(b) {
        var a = b.label();
        var inputLabel = b.inputLabel();
        this.input.val(inputLabel);
        this.currentText = a;
        this.onSelect(b)
    },
    reset: function() {
        this.$el.empty();
        return this
    },
    hide: function() {
        this.$el.hide();
        return this
    },
    show: function() {
        this.$el.show();
        return this
    },
    onSelect: function() {}
});