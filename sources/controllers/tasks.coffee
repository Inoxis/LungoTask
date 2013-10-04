class __Controller.TasksCtrl extends Monocle.Controller

    events:
      "click [data-action=new]"    :   "onNew"
      

    elements:
      "#pending"    :   "pending"
      "#important"  :   "important"
      "input"       :   "name"

    constructor: ->
      super
      __Model.Task.bind "create", @bindTaskCreated
      __Model.Task.bind "update", @bindTaskUpdated
      __Model.Task.bind "destroy", @bindTaskDestroyed 
           

    onNew: (event) ->
      __Controller.Task.new()


    bindTaskCreated: (task) => 
      
      context = if task.important is true then "high" else "normal"
      new __View.Task model: task, container: "article##{context} ul"
      @renderTotals()
      Lungo.Router.back()
      Lungo.Notification.hide()

    bindTaskUpdated: (task) =>  
      @renderTotals()
      Lungo.Router.back()
      Lungo.Notification.hide()  
    
    bindTaskDestroyed: (task) =>
      @renderTotals()


    renderTotals: ->
      Lungo.Element.count("#pending", __Model.Task.pending().length)
      Lungo.Element.count("#important", __Model.Task.important().length)
      
   


$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"
