var test = { "mappings": {
                        "doc": {
                            "_all": {
                                "enabled": false
                            },
                            "properties": {
                                "my_attachment": { "type": "attachment" }
                            }}}
          };
var loaded = true;
//$("#loadindex").click(function(){
//Indexing document
$(document).ready(function(){
if(loaded){
  $.ajax({
                type: "PUT",
                url: 'http://localhost:9200/trying-out-mapper-attachments',
                data:  JSON.stringify(test),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (msg)
                {
                    console.log("created property mapping using new type attachment");
                },
                error: function (err)
                { console.log(err.responseText +"shitty");}
            });
    }else{
    loaded = false;
}
});
var handleFileSelect = function(evt) {
    var files = evt.target.files;

for (var i = 0; i < files.length; i++) {
    setupReader(files[i]);
}
    function setupReader(file){
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            console.log("fileloaded");
            var upload = {
                "title" : file.name,
                    "my_attachment" : {
                        "_content" : btoa(binaryString)
                     }
            };

            //document.getElementById("base64textarea").value = btoa(binaryString);
            $.ajax({
                type: "POST",
                //async: false,
                url: 'http://localhost:9200/trying-out-mapper-attachments/doc/',
                data:  JSON.stringify(upload),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (msg)
                {
                    console.log("the json is "+ msg._index + msg._type + msg._id);
                 //   console.log(msg);
                },
                error: function (err)
                { console.log(err.responseText +"shitty");}
            });
        };

        reader.readAsBinaryString(file);
    }
};
document.getElementById('file-select').addEventListener('change', handleFileSelect, false);




/*$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: "http://localhost:9200/twitter/tweet/9",
    success: function(data){
        //alert(JSON.stringify(data));
        console.log(JSON.stringify(data) + "data");
    }
});*/

//Suche nach Dokumente mit dem Ti

/*$("#searchText").val()*/
$("#searchButton").click(function(){
    //var query = {"explain": true, "query": {"match": {"cv": "dri" }}};
    var query = {"explain": true, "query": { "query_string":  {"default_field" : "my_attachment.content", "query": "Dri" }}};

    $.ajax({
        type: "POST",
        //async: false,
        dataType: "json",
        url: 'http://localhost:9200/trying-out-mapper-attachments/doc/_search?source=' + JSON.stringify(query),
        success: function(data){
          //  console.log(data.hits.hits[0]._source.my_attachment._content);
           renderResultList(data);
        },
        error: function (err)
        { console.log(err.responseText +" shitty");}
        //data: JSON.stringify(query)
    });
});

var renderResultList = function(data){
            $('#result').append("<ul id='newList' class='list-group'></ul>");
                console.log(data);

    data.hits.hits.forEach(function(i, l) {
console.log(i._score);

                $("#newList").append("<li id='listItem" + l + "'" + "class='list-group-item'>"+ i._source.title +"</li>");
                $("#listItem" + l).append("<span class='label label-default label-pill pull-right'>" + 14 + "</span>");
 });
};
