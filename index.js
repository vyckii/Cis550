var express = require('express')
var app = express()
var path = require('path')
var oracledb = require('oracledb')
var NodeGeocoder = require('node-geocoder')
oracledb.autoCommit = true
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
    console.log('Testing database link...')
    connection.execute("SELECT * FROM BUSINESS where STATE = 'OH' and rownum = 1", // bind value for :id
        function(err, result) {
            if (err) {
                console.error(err.message)
                //doRelease(connection) 
                return
            }
            console.log(result.rows)
            console.log('\nStart working...\n')
            //doRelease(connection)
        })
})
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyCeZQMIEHkPo_I0CQ9gAaV3Yf6juKQsbjw', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
}
var geocoder = NodeGeocoder(options)
geocoder.geocode('29 champs elysée paris', function(err, res) {
    console.log('Testing geocode...')
    console.log(res)
    console.log('\nStart working...\n')
})
var lat = ""
var long = ""
// Using callback
function doRelease(connection) {
    connection.close(function(err) {
        if (err) console.error(err.message)
    })
}
app.set('port', (process.env.PORT || 5004))
app.use(express.static(__dirname + '/public'))
app.get('/quit', function(request, response) {
    doRelease(database)
    process.exit()
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
app.get('/search_index', function(request, response) {
    console.log('search')
    response.sendFile(path.join(__dirname, '/', 'search_index.html'))
})
app.get('/search_script.js', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'search_script.js'))
})
app.get('/search', function(request, response) {
    console.log('search')
    response.sendFile(path.join(__dirname, '/', 'search.html'))
})
app.get('/search_feature/:city/:feature/:time', function(request, response) {
    var city = request.params.city
    var feature = request.params.feature
    var time = request.params.time.toString()
    var cityQuery = ""
    var featureQuery = ""
    var timeQuery = ""
    if (city != "undefined") {
        cityQuery = "b.CITY = '" + city + "'"
    }
    if (feature != "undefined") {
        featureQuery = "c.FEATURE = '" + feature + "'"
    }
    if (time != "undefined") {
        var myDate = new Date()
        var days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        var today = days[(myDate.getDay() + 6) % 7]
        var open = "h." + today + "_O"
        var close = "h." + today + "_C"
        timeQuery = open + " < " + "'" + time + "'" + " AND " + close + " > " + "'" + time + "'"
    }
    console.log(cityQuery)
    console.log(featureQuery)
    console.log(timeQuery)
    //var query = "select b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c\
    //where  c.FEATURE = '" + feature + "' and b.CITY = '" + city + "'" 
    var query = "select DISTINCT b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c natural join HOUR h "
    if (cityQuery != "" || featureQuery != "" || timeQuery != "") {
        query = query + "WHERE "
    }
    var prev = 0
    if (cityQuery != "") {
        query = query + cityQuery
        prev = prev | 1
    }
    if (featureQuery != "") {
        if (prev == 1) {
            query = query + " AND "
        }
        prev = prev | 1
        query = query + featureQuery
    }
    if (timeQuery != "") {
        if (prev == 1) {
            query = query + " AND "
        }
        prev = prev | 1
        query = query + timeQuery
    }
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log("Get " + (result.rows).length + " results.")
        response.send(result.rows)
    })
})
app.get('/near', function(request, response) {
    console.log('search_near ')
    response.sendFile(path.join(__dirname, '/', 'near_me.html'))
})
app.get('/search_near/:addr/:feature', function(request, response) {
    var addr = request.params.addr
    var feature = request.params.feature
    console.log(addr, feature)
    getAddr(addr)
    setTimeout(function() {
        runNear(feature, response)
    }, 5000)
})

function getAddr(addr) {
    // stuff you want to happen right away
    console.log('Finding location for you...')
    geocoder.geocode(addr, function(err, res) {
        lat = res[0].latitude
        long = res[0].longitude
    })
}

function runNear(feature, response) {
    var query = "select DISTINCT b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c WHERE (b.LAT -(" + lat + ")) * (b.LAT -(" + lat + ")) + (b.LON -(" + long + ")) * (b.LON -(" + long + ")) < 3"
    if (feature != "undefined") {
        query = query + " AND c.FEATURE = '" + feature + "'"
    }
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log("Get " + (result.rows).length + " results.")
        response.send(result.rows)
    })
}
app.get('/popular', function(request, response) {
    console.log('pop')
    response.sendFile(path.join(__dirname, '/', 'popular.html'))
})
app.get('/search_pop/:city/:feature', function(request, response) {
    var city = request.params.city
    var feature = request.params.feature
    console.log(city, feature)
    var query = "select DISTINCT b.NAME, b.ADDRESS, b.STARS, b.REVIEW_COUNT from BUSINESS b natural join CATEGORIES c WHERE b.CITY = '" + city + "' AND (b.REVIEW_COUNT > 100 OR b.STARS = 5)"
    if (feature != "undefined") {
        query = query + " AND c.FEATURE = '" + feature + "'"
    }
    query = query + " ORDER BY b.REVIEW_COUNT"
    console.log(query)
    database.execute(query, function(error, result) {
        if (error) {
            throw error
            return
        }
        console.log("Get " + (result.rows).length + " results.")
        response.send(result.rows)
    })
})
app.listen(app.get('port'), function() {
    console.log("\nNode app is running at localhost:" + app.get('port') + "\n")
})