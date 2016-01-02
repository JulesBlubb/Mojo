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
                    "_title" : file.name,
                    "_content" : btoa(binaryString)
            }
            };

            //document.getElementById("base64textarea").value = btoa(binaryString);
            $.ajax({
                type: "POST",
                //async: false,
                url: 'http://localhost:9200/twitter/tweet/',
                data:  JSON.stringify(upload),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (msg)
                {
                    console.log("the json is "+ msg._index + msg._type + msg._id + upload.my_attachment._title);
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


/*var query = {query : {match : {title : "DriTest.pdf" }}};

$.ajax({
    type: "GET",
   //async: false,
    dataType: "json",
    url: 'http://localhost:9200/twitter/_search?source=' + JSON.stringify(query),
    success: function(data){
        //alert(JSON.stringify(data));
        console.log(JSON.stringify(data));

    },
    error: function (err)
    { console.log(err.responseText +" shitty");}
    //data: JSON.stringify(query)
});*/
