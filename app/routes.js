
const HandleTodos = require('./updatetodos.js');
const SelectFiles = require('./selectfiles.js');

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
	    HandleTodos("find", req, res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
	    HandleTodos("create", req, res);
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
	    HandleTodos("delete", req, res);
    });

    // map location
    app.get('/api/maploc', function (req, res) {  
	    SelectFiles(app, req, res);

    });


    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
	    console.log(__dirname);
	    console.log(process.cwd());

	    // __dirname is C:\webs\node-todo\node-todo-master\app
	    // cwd is C:\webs\node-todo\node-todo-master
	    // use cwd instead  - zhao

	    //res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	res.sendFile(process.cwd() + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    // map location
    
};
