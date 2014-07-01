/*global jQuery, Handlebars */
jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('eq', function(a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var DEBUG = true;

    var util = {
        uuid: function () {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function (namespace, data) {
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        },

        makeBasicAuth: function (username, password) {
            var tok = username + ':' + password;
            var hash = btoa(tok);
            return "Basic " + hash;
        },

        ssoToken: null,
        getSsoToken: function() {
            if (util.ssoToken == null || util.ssoToken.ssoToken == "") {
                $.ajax({
                    url: "/tmtrack/tmtrack.dll?JSONPage&Command=getssotoken",
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        util.ssoToken = json.result.token;
                    }
                });
            }

            return this.ssoToken;
        }
    };

    var AppInventory = {
        init: function () {
            this.appFilter = "?name=";
            this.appRequest = $.ajax({
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "DirectSsoInteraction": false,
                    "Authorization": util.makeBasicAuth("admin", "admin")
                },
                url: "proxy/serena_ra/rest/deploy/application" + (this.appFilter.length > 0 ? this.appFilter : "")
            });
            this.cacheElements();
            //this.bindEvents();

            /*Router({
                '/:filter': function (filter) {
                    this.filter = filter;
                    this.render();
                }.bind(this)
            }).init('/all');*/
            this.render();
        },
        cacheElements: function () {
            this.appTemplate = Handlebars.compile($('#app-template').html());
            this.appEnvTemplate = Handlebars.compile($('#app-env-template').html());
            this.compEnvTemplate = Handlebars.compile($('#comp-env-template').html());
            //this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.$app = $('#app');
            this.$header = this.$app.find('#header');
            this.$main = this.$app.find('#main');
            this.$footer = this.$app.find('#footer');
            //this.$toggleAll = this.$main.find('#toggle-all');
            this.$AppList = this.$main.find('#app-list');
            //this.$count = this.$footer.find('#todo-count');
            //this.$clearBtn = this.$footer.find('#clear-completed');
        },
        bindEvents: function () {
            var list = this.$todoList;
            this.$newTodo.on('keyup', this.create.bind(this));
            this.$toggleAll.on('change', this.toggleAll.bind(this));
            this.$footer.on('click', '#clear-completed', this.destroyCompleted.bind(this));
            list.on('change', '.toggle', this.toggle.bind(this));
            list.on('dblclick', 'label', this.edit.bind(this));
            list.on('keyup', '.edit', this.editKeyup.bind(this));
            list.on('focusout', '.edit', this.update.bind(this));
            list.on('click', '.destroy', this.destroy.bind(this));
        },
        render: function (data) {
            var self = this;
            this.appRequest.then(function(data) {
                self.$AppList.html(self.appTemplate(data));

                // get the environments for each application
                $.each(data, function(i, app) {
                    if (DEBUG) console.log("getting environments for " + app.id);
                    $.ajax({
                        contentType: "application/json",
                        dataType: "json",
                        //headers: { ALFSSOAuthNToken: util.getSsoToken() },
                        headers: {
                            "DirectSsoInteraction": false,
                            "Authorization": util.makeBasicAuth("admin", "admin")
                        },
                        url: "proxy/serena_ra/rest/deploy/application/" + app.id + "/environments/false"
                    }).then(function(data) {
                        if (DEBUG) console.log(data);
                        this.$AppEnvList = self.$AppList.find('#env-list-'+app.id);
                        this.$AppEnvList.html(self.appEnvTemplate(data));

                        // line up environments
                        $.each(['xs', 'sm', 'md', 'lg'], function(idx, gridSize) {
                            $('.col-' + gridSize + '-auto:first').parent().each(function() {
                                //we count the number of childrens with class col-md-6
                                var numberOfCols = $(this).children('.col-' + gridSize + '-auto').length;
                                if (numberOfCols > 0 && numberOfCols < 13) {
                                    var minSpan = Math.floor(12 / numberOfCols);
                                    var remainder = (12 % numberOfCols);
                                    $(this).children('.col-' + gridSize + '-auto').each(function(idx, col) {
                                        var width = minSpan;
                                        if (remainder > 0) {
                                            width += 1;
                                            remainder--;
                                        }
                                        $(this).addClass('col-' + gridSize + '-' + width);
                                    });
                                }
                            });
                        });

                        // get the inventory for each environment
                        $.each(data, function(i, env) {
                            if (DEBUG) console.log("getting inventory for " + env.id);
                            $.ajax({
                                contentType: "application/json",
                                dataType: "json",
                                headers: {
                                    "DirectSsoInteraction": false,
                                    "Authorization": util.makeBasicAuth("admin", "admin")
                                },
                                url: "proxy/serena_ra/rest/deploy/environment/" + env.id + "/latestDesiredInventory/"
                            }).then(function(data) {
                                if (DEBUG) console.log(data);
                                this.$CompEnvList = self.$AppList.find('#comp-env-list-' + env.id);
                                this.$CompEnvList.html(self.compEnvTemplate(data));
                            });
                        });

                    });
                });
            });
            /*var todos = this.getFilteredTodos();
             this.$todoList.html(this.todoTemplate(todos));
             this.$main.toggle(todos.length > 0);
             this.$toggleAll.prop('checked', this.getActiveTodos().length === 0);
             this.renderFooter();
             this.$newTodo.focus();
             util.store('todos-jquery', this.todos);*/
        },
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.getActiveTodos().length;
            var template = this.footerTemplate({
                activeTodoCount: activeTodoCount,
                activeTodoWord: util.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount,
                filter: this.filter
            });

            this.$footer.toggle(todoCount > 0).html(template);
        },
        toggleAll: function (e) {
            var isChecked = $(e.target).prop('checked');

            this.todos.forEach(function (todo) {
                todo.completed = isChecked;
            });

            this.render();
        },
        getActiveTodos: function () {
            return this.todos.filter(function (todo) {
                return !todo.completed;
            });
        },
        getCompletedTodos: function () {
            return this.todos.filter(function (todo) {
                return todo.completed;
            });
        },
        getFilteredTodos: function () {
            if (this.filter === 'active') {
                return this.getActiveTodos();
            }

            if (this.filter === 'completed') {
                return this.getCompletedTodos();
            }

            return this.todos;
        },
        destroyCompleted: function () {
            this.todos = this.getActiveTodos();
            this.filter = 'all';
            this.render();
        },
        // accepts an element from inside the `.item` div and
        // returns the corresponding index in the `todos` array
        indexFromEl: function (el) {
            var id = $(el).closest('li').data('id');
            var todos = this.todos;
            var i = todos.length;

            while (i--) {
                if (todos[i].id === id) {
                    return i;
                }
            }
        },
        create: function (e) {
            var $input = $(e.target);
            var val = $input.val().trim();

            if (e.which !== ENTER_KEY || !val) {
                return;
            }

            this.todos.push({
                id: util.uuid(),
                title: val,
                completed: false
            });

            $input.val('');

            this.render();
        },
        toggle: function (e) {
            var i = this.indexFromEl(e.target);
            this.todos[i].completed = !this.todos[i].completed;
            this.render();
        },
        edit: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            $input.val($input.val()).focus();
        },
        editKeyup: function (e) {
            if (e.which === ENTER_KEY) {
                e.target.blur();
            }

            if (e.which === ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function (e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if ($el.data('abort')) {
                $el.data('abort', false);
                this.render();
                return;
            }

            var i = this.indexFromEl(el);

            if (val) {
                this.todos[i].title = val;
            } else {
                this.todos.splice(i, 1);
            }

            this.render();
        },
        destroy: function (e) {
            this.todos.splice(this.indexFromEl(e.target), 1);
            this.render();
        }
    };

    AppInventory.init();
});