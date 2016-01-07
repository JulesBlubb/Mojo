var http = require('http');


var responseHandler = function(res) {
    return function(response) {
        var data = '';

        //another chunk of data has been recieved, so append it to `data`
        response.on('data', function (chunk) {
            data += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            console.log("replying ");
            res.writeHead(200, {'Content-Type': 'text/javascript',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                                'Access-Control-Allow-Headers': 'Content-Type'});

            res.write(data);
            res.end();
        });
    };
};


var queryfn = function(res, query_string) {
    var query = {"from" : 0, "size" : 100, "query": {"match": {"my_attachment.content":  query_string}}};


    var index = "documentsearch";
    var options = {
        host: 'localhost',
        port: '9200',
        path: '/' + index + '/doc/_search?search_type=dfs_query_then_fetch&source=' + JSON.stringify(query)
    };

    http.request(options, responseHandler(res)).end();
};


var addfn = function(res, document) {
    var index = "documentsearch";
    var options = {
        method: "POST",
        host: 'localhost',
        port: '9200',
        path: '/' + index + '/doc/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(document)
        }
    };

    var post_req = http.request(options, responseHandler(res));
    post_req.write(document);
    post_req.end();
};


var s = http.createServer(function(req, res) {
    if(req.url.startsWith("/search")) {
        query_string = req.url.match(/\/search\/(.+)/)[1];
        console.log("searching " + query_string);
        queryfn(res, query_string);
    } else if(req.url.startsWith("/add")) {
        console.log("adding " + req);

        var body = "";

        req.on('data', function(chunk) {
            console.log("Received body data:");
            body += chunk.toString();
        });

        req.on('end', function() {
            console.log("Adding: " + body);
            addfn(res, body);
        });
    } else {
        console.log("du kommscht hier nich rein " + req.url);
        res.end();
    }
});

s.listen(8000);
console.log('Server running at http://127.0.0.1:8000/');
