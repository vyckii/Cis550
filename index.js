var express = require('express')
var app = express()
var path = require('path')
var oracledb = require('oracledb')
// var dbConfig = require('./dbconfig.js');
oracledb.autoCommit = true;
var database
oracledb.getConnection({
    user: "Group8",
    password: "myownyelp",
    connectString: "cis550project.c6y5gn1mrsa8.us-east-2.rds.amazonaws.com/PROJ550"
}, function(err, connection) {
    if (err) {
        console.error(err.message)
        return
    }
    database = connection
    connection.execute("SELECT * FROM BUSINESS where STATE = 'OH' and rownum = 1", // bind value for :id
        function(err, result) {
            if (err) {
                console.error(err.message)
                //doRelease(connection) 
                return
            }
            console.log(result.rows)
            //doRelease(connection) 
        })
})

function doRelease(connection) {
    connection.close(function(err) {
        if (err) console.error(err.message)
    })
}
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.get('/quit', function(request, response) {
    doRelease(database)
})
app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'login.html'))
})
app.get('/login_script.js', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'login_script.js'))
})
app.get('/login_info/:user_id/:password', function(request, response) {
    var user_id = request.params.user_id
    var password = request.params.password
    var query = "select USER_ID from USERS where USER_ID = '" + user_id + "' and PASSWORD = '" + password + "'"
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log(result.rows)
        response.send(result.rows)
    })
})
app.get('/signup_check/:user_id', function(request, response) {
    var user_id = request.params.user_id
    var query = "select USER_ID from USERS where USER_ID = '" + user_id + "'"
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log(result.rows)
        response.send(result.rows)
    })
})
app.get('/signup_info/:user_id/:password', function(request, response) {
    var user_id = request.params.user_id
    var password = request.params.password
    var query = "insert into USERS (USER_ID, NAME, REVIEW_COUNT, PASSWORD) values ('" + user_id + "', '" + user_id + "', 0,'" + password + "')"
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log(result.rows)
        response.send(result.rows)
    })
})
app.get('/search', function(request, response) {
    console.log('search')
    response.sendFile(path.join(__dirname, '/', 'search.html'))
})
app.get('/search_script.js', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'search_script.js'))
})
app.get('/search_feature/:city/:feature/:time', function(request, response){
    var city = request.params.city
    var feature = request.params.feature
    var time = request.params.time
    var cityQuery = ""
    var featureQuery = ""
    var timeQuery = ""

    if(city != "undefined"){
        cityQuery = "b.CITY = '" + city + "'"
    }
    if(feature != "undefined"){
        featureQuery = "c.FEATURE = '" + feature + "'"
    }
    if(time != "undefined"){
        var myData = new Date();
        var days = ['Monday', 'Tuesday']
        timeQuery = " .CITY = '" + city + "'"
    }
    console.log('city:' + city + ' feature: ' + feature)
    
    //var query = "select b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c\
                 //where  c.FEATURE = '" + feature + "' and b.CITY = '" + city + "'" 
    var query = "select b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c "


    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log(result.rows)
        response.send(result.rows)
    })
})

// app.get('/searchbest/:city', function(request, response){
//     var city = request.params.city
//     var query = "select NAME, LAT, LOG, STARS, REVIEW_COUNT from BUSINESS \
//                  where STARS = (select max(b.from BUSINESS b \
//                                 group by b.STATE \
//                                 HAVING b.city = '" + city + "') AND CITY = '"  + city + "'"
//     database.execute(query, function(error, result) {
//         if (error) {
//             throw error
//             return
//         }
//         console.log(result.rows)
//         response.send(result.rows)
//     })
// })

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})