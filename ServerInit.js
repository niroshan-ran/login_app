let {parse} = require('querystring');

let http = require('http');

let MongoClient = require('mongodb').MongoClient;
let uri = "mongodb+srv://Niroshan:MUjfbG3ftzj5UWAW@cluster0-gubki.azure.mongodb.net/test?retryWrites=true&w=majority";
let client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });

let html =
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<title>Login</title>' +
    '</head>' +
    '<body>' +
    '<form method="post" id="loginForm">' +
    '<table>' +
    '<tr>' +
    '<td>' +
    '<label for="uname">Username</label>' +
    '</td>' +
    '<td>' +
    '<input id="uname" type="text" name="username">' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<label for="pword">Password</label>' +
    '</td>' +
    '<td>' +
    '<input id="pword" type="password" name="password">' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<input type="submit" value="Login">' +
    '</td>' +
    '<td>' +
    '<input type="reset" value="Reset">' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</form>' +
    '</body>' +
    '</html>';

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    } else {
        callback(null);
    }
}

http.createServer(function (request, response) {


    if (request.method === 'POST') {

        collectRequestData(request, result => {
            console.log(result);

            client.connect(err => {

                if (err) throw err;

                let dbo = client.db("UsersDatabase");

                let query = {username: result.username, password: result.password};

                dbo.collection("Users").find(query).toArray(function (err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end('<h2 style="color: green">Login&nbsp;Success</h2>');
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end('<h2 style="color: red">Login&nbsp;Fail</h2>');

                    }

                });

            });

        });


    } else {


        response.end(html);

        /*client.connect(err => {

            if (err) throw err;

            const dbo = client.db("UsersDatabase");

            // perform actions on the collection object

            var myobj = [
              { username: 'Niroshan', password: 'Niroshan123'},
              { username: 'admin', password: 'admin'}
            ];
            dbo.collection("Users").insertMany(myobj, function(err, res) {
              if (err) throw err;
              console.log("Number of documents inserted: " + res.insertedCount);

            });*/


        /*client.close();
      });*/
    }


}).listen(3002);
