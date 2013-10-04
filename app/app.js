(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.Task = (function(_super) {
    __extends(Task, _super);

    function Task() {
      _ref = Task.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Task.fields("name", "description", "list", "when", "important", "done");

    Task.pending = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.completed = function() {
      return this.select(function(task) {
        return !!task.done;
      });
    };

    Task.important = function() {
      return this.select(function(task) {
        return task.important === true;
      });
    };

    return Task;

  })(Monocle.Model);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.Task = (function(_super) {
    __extends(Task, _super);

    Task.prototype.template = "<li>\n  <div class=\"on-right\">{{list}}</div>\n  <strong>{{name}}</strong>\n  <small>{{description}}</small>\n</li>";

    function Task() {
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      Task.__super__.constructor.apply(this, arguments);
      this.append(this.model);
      __Model.Task.bind("update", this.bindTaskUpdated);
    }

    Task.prototype.events = {
      "swipeLeft li": "onDelete",
      "hold li": "onDone",
      "singleTap li": "onView"
    };

    Task.prototype.elements = {
      "input.toggle": "toggle"
    };

    Task.prototype.onDone = function(event) {
      return console.log("[DONE]", this.model);
    };

    Task.prototype.onDelete = function(event) {
      this.model.destroy();
      return this.remove();
    };

    Task.prototype.onView = function(event) {
      return __Controller.Task.show(this.model);
    };

    Task.prototype.bindTaskUpdated = function(task) {
      console.log(this.model.important);
      this.model.save();
      return this.refresh();
    };

    return Task;

  })(Monocle.View);

}).call(this);

(function() {
  var TaskCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCtrl = (function(_super) {
    __extends(TaskCtrl, _super);

    TaskCtrl.prototype.elements = {
      "input[name=name]": "name",
      "textarea[name=description]": "description",
      "input[name=list]": "list",
      "select[name=when]": "when",
      "input[name=important]": "important"
    };

    TaskCtrl.prototype.events = {
      "click [data-action=save]": "onSave"
    };

    function TaskCtrl() {
      TaskCtrl.__super__.constructor.apply(this, arguments);
      this["new"] = this._new;
      this.show = this._show;
    }

    TaskCtrl.prototype.onSave = function(event) {
      if (this.current) {
        this.current.name = this.name.val();
        this.current.description = this.description.val();
        this.current.list = this.list.val();
        this.current.when = this.when.val();
        this.current.important = this.important[0].checked;
        return this.current.save();
      } else {
        Lungo.Notification.show();
        return __Model.Task.create({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      }
    };

    TaskCtrl.prototype._new = function(current) {
      this.current = current != null ? current : null;
      this.name.val("");
      this.description.val("");
      return Lungo.Router.section("task");
    };

    TaskCtrl.prototype._show = function(current) {
      this.current = current;
      this.name.val(this.current.name);
      this.description.val(this.current.description);
      return Lungo.Router.section("task");
    };

    return TaskCtrl;

  })(Monocle.Controller);

  $$(function() {
    return __Controller.Task = new TaskCtrl("section#task");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.TasksCtrl = (function(_super) {
    __extends(TasksCtrl, _super);

    TasksCtrl.prototype.events = {
      "click [data-action=new]": "onNew"
    };

    TasksCtrl.prototype.elements = {
      "#pending": "pending",
      "#important": "important",
      "input": "name"
    };

    function TasksCtrl() {
      this.bindTaskDestroyed = __bind(this.bindTaskDestroyed, this);
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      this.bindTaskCreated = __bind(this.bindTaskCreated, this);
      TasksCtrl.__super__.constructor.apply(this, arguments);
      __Model.Task.bind("create", this.bindTaskCreated);
      __Model.Task.bind("update", this.bindTaskUpdated);
      __Model.Task.bind("destroy", this.bindTaskDestroyed);
    }

    TasksCtrl.prototype.onNew = function(event) {
      return __Controller.Task["new"]();
    };

    TasksCtrl.prototype.bindTaskCreated = function(task) {
      var context;
      context = task.important === true ? "high" : "normal";
      new __View.Task({
        model: task,
        container: "article#" + context + " ul"
      });
      this.renderTotals();
      Lungo.Router.back();
      return Lungo.Notification.hide();
    };

    TasksCtrl.prototype.bindTaskUpdated = function(task) {
      this.renderTotals();
      Lungo.Router.back();
      return Lungo.Notification.hide();
    };

    TasksCtrl.prototype.bindTaskDestroyed = function(task) {
      return this.renderTotals();
    };

    TasksCtrl.prototype.renderTotals = function() {
      Lungo.Element.count("#pending", __Model.Task.pending().length);
      return Lungo.Element.count("#important", __Model.Task.important().length);
    };

    return TasksCtrl;

  })(Monocle.Controller);

  $$(function() {
    var Tasks;
    Lungo.init({});
    return Tasks = new __Controller.TasksCtrl("section#tasks");
  });

}).call(this);
