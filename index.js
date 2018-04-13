var express = require('express')
var app = express()
var mysql = require('mysql');
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/login', function(request, response) {
  response.sendFile(__dirname + '/login.html');
})
app.get('/signup', function(request, response) {
  response.sendFile(__dirname  + '/signup.html');
})
app.get('/p5', function(request, response) {
  response.sendFile(__dirname  + '/p5.html');
})



// app.get('/family', function(request, response) {
//   response.sendFile('/Users/vyckii/node-js-sample2/family.html');
// })
// app.get('/bikes', function(request, response) {
//   response.sendFile('/Users/vyckii/node-js-sample2/bikes.html');
// })
// app.get('/script.js', function(request, response) {
// 	response.sendFile('/Users/vyckii/node-js-sample2/script.js');
// })
// app.get('/friend', function(req,res) {
//   // use console.log() as print() in case you want to debug, example below:
//   // console.log("inside person email");
//   var query = 'select p.name, c.count from Person p join (select login, count(login) as count from Friends group by login) c on p.login = c.login';
//   console.log(query);
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//         res.json(rows);
//     }  
//     });
// });
// app.get('/data/:name', function(req,res) {
//   // use console.log() as print() in case you want to debug, example below:
//   // console.log("inside person email");
//   var name = req.params.name;
//   //var query = 'select p.name, c.count from Person p join (select login, count(login) as count from Friends group by login) c on p.login = c.login';
//   var query = 'select pp.login, pp.name, j.role, pp.sex,pp.relationshipStatus, pp.birthyear from Person as pp join (select a.login, a.name, f.member, f.role from (select p.login, p.name from Person p where p.name ="' +name+ '" ) a join Family f on a.login = f.login) j on j.member = pp.login';
//   console.log(name);
//   console.log(query);
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//         res.json(rows);
//     }  
//     });
// });
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
