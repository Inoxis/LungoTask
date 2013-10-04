class __View.Task extends Monocle.View

  template  : """
    <li>
      <div class="on-right">{{list}}</div>
      <strong>{{name}}</strong>
      <small>{{description}}</small>
    </li>
  """

  constructor: ->
    super
    @append @model
    __Model.Task.bind "update", @bindTaskUpdated
    



  events:
    "swipeLeft li"  :  "onDelete"
    "hold li"       :  "onDone"
    "singleTap li"  :  "onView"
   

  elements:
    "input.toggle"             : "toggle"

  onDone: (event) ->
    console.log "[DONE]", @model

  onDelete: (event) ->
    @model.destroy()
    @remove()
    

  onView: (event) ->
    __Controller.Task.show @model

  bindTaskUpdated: (task) =>
      console.log @model.important 
      @model.save()
      @refresh()
  






  



  

  










