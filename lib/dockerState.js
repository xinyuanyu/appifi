/*

Docker State

1. top state: daemon started, daemon stopped

1.1 daemon started

this.status > 0
this.daemon !== null
this.eventListener !== null // returned from dockerEventsAgent, a dockeragent instance
this.tasks = []

1.2 daemon stopped

this.status === 0
this.daemon = {
    pid: integer, // docker daemon pid
    volume: uuid, // volume running docker daemon 
  }
this.eventListener === null
this.tasks = [] // length 0..n

2. state transition

daemonStart or init (detected running), but NOT spontaneous (TODO)
daemonStop or spontaneous (daemon die) 

daemonStart is an operation, except the initial detection there is no event to trigger state transition.

daemonStop is an operation, and eventListener disconnect is the event.

event is the action (according to definition in TLA) but operation is not.

3. task

task is defined with a common interface, like a base class

3.1 basic info

parent, type, id, status, error, message, display() 

example:

  type = 'appInstall'
  id = 'signature' // if not appname
  status = 'started' or 'stopped'
  
  errno = errno
  message = message

  getState() => combine above info with _getState()  

4. event flow

4.1 source: eventlistener 

a) trigger update
b) trigger stop / reset

4.2 source: tasks

a) trigger status count increment

5. delayed update



*/

class DockerState {

  construct() {
    this.status = 0
    this.daemon = null
    this.tasks: []
  }

  attach() {

  }

  reset() {
    this = {
      status: 0,
      this.daemon = null
      tasks: []
    }
  }

  updateStatus() {
    this.status++
  }

  updateDockerState(state) {

    // destructive
    let {status, tasks} = this
    this = Object.assign({status, tasks}, state)
    this.status++
  }

  addTask(task) {
    this.tasks.push(task)
    this.status++
  }

  removeTask(task) {
    this.tasks.push(task)
    this.status++
  }

  getState() {
    return Object.assign({}, this, {
      tasks: this.tasks.map(t => t.getState())
    }) 
  }
}



