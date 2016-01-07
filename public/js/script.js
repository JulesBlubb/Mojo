/** Erstellen des Index,
my_attachment -> macht es möglich Dokumente in über tausend Formaten zu indexieren
https://www.elastic.co/guide/en/elasticsearch/plugins/master/mapper-attachments.html*/
var indexSetting = {
    "mappings": {
        "doc": {
            "properties": {
                "my_attachment": { "type": "attachment" }}}}};

$(document).ready(function(){
        $.ajax({
            type: "PUT",
            url: 'http://localhost:9200/documentsearch',
            data:  JSON.stringify(indexSetting),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (msg)
            {
                console.log("created index documentsearch");
            },
            error: function (err)
            { console.log(err.responseText +"shitty");}
        });
});

// Verwaltung der hochgeladenen Dokumente
var handleFileSelect = function(evt) {
    var files = evt.target.files;
    // Schleife die alle ausgewählten Dokumente nacheinander in elasticsearch einspeißt
    for (var i = 0; i < files.length; i++) {
        setupReader(files[i]);
    }
    function setupReader(file){
        var reader = new FileReader();
        /* sobald eine Datei ausgewählt wurde(onload) wird das readerEvt(event)
           getriggert und das Dokument mit dem*/
        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            console.log("fileloaded");
            /* query wird um das Attribut 'title' ergänzt um den
               original Dateinamen beizubehalten und der gesamte
               Dokumenteninhalt(readerEvt.target.result) wird in
               Base64 format überführt('btoa()')*/
            var upload = {
                "title" : file.name,
                "my_attachment" : {
                    "_content" : btoa(binaryString)
                }
            };

            // ajax funktion um ein Dokument hinzuzufügen(add) als elasticsearch query
            $.ajax({
                type: "POST",
                url: 'http://localhost:8000/add',
                data:  JSON.stringify(upload),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (msg)
                {
                    console.log("the json is "+ msg._index + ", " + msg._type + ", " + msg._id);
                },
                error: function (err)
                { console.log(err.responseText +" shitty");}
            });
        };

        reader.readAsBinaryString(file);
    }
};
//Verknüpfung zum Frontend
document.getElementById('file-select').addEventListener('change', handleFileSelect, false);


/** https://www.elastic.co/blog/understanding-query-then-fetch-vs-dfs-query-then-fetch
-> um ein korrektes Ranking zu bekommen, wird der InverseDocumentFrequency über alle Shards berechnet.

 Suchfunktion, hier wird der Inhalt des Suchfeldes abgefangen und in ein Such-Query
 eingefügt und als query_string an elasticsearch weitergeleitet.*/
$("#searchButton").click(function(){
    $('#example').twbsPagination({
        totalPages: 1,
        visiblePages: 1
    });
    $.ajax({
        type: "POST",
        dataType: "json",
        url: 'http://localhost:8000/search/'+$("#searchText").val(),
        success: function(data){
            renderResultList(data);
        },
        error: function (err)
        {console.log(err.responseText +" shitty");}
    });
});

/** Bei Treffern nach einer Suche, werden die hits in einer Liste aufgezeigt.
    Diese ist sortiert nach der Anzahl an Treffern des Suchtextes
    innerhalb eines Dokuments*/
var renderResultList = function(data){
    var listHtml;
    var result = $('#result');
    result.children().remove();
    result.append("<ul id='newList' class='list-group'></ul>");
    console.log(data);

    data.hits.hits.forEach(function(i, l) {
        console.log(i._score);
        $("#newList").append("<li id='listItem" + l + "'" + "class='list-group-item'><a data-toggle='modal' data-target='#mymodal" + l + "'" + "id='clickedItem" + l + "'" + ">" + i._source.title +"</a></li>");
        $("#listItem" + l).append("<span class='label label-default label-pill pull-right'>" + i._score + "</span>");
        renderContent(i,l);
    });
    listHtml = result.children();
    var listCount = listHtml.size();
    var showPerPage = 5;
    var pagesNeed = showPerPage/listCount;
    console.log(listHtml);
    $('#example').twbsPagination({
        totalPages: pagesNeed,
        visiblePages: 4,
        onPageClick: function (event, page) {
            listHtml.children().css('display', 'none').slice((page-1)*5,(page-1)*showPerPage+showPerPage).css('display', 'block');
        }
    });
    renderPaginator(listHtml, listCount, pagesNeed, showPerPage);
};

var renderPaginator = function(listHtml, items, total, showPerPage){

    $('#example').twbsPagination('destroy');<!-- hide all the elements inside content div -->
        $('#example').twbsPagination({
            startPage: 1,
            totalPages: total,
            visiblePages: 4,
            onPageClick: function (event, page) {
                listHtml.children().css('display', 'none').slice((page-1)*5,(page-1)*showPerPage+showPerPage).css('display', 'block');
            }
        });
};

// bei Auswahl eines Dokuments wird ein Bootstrap Modal geöffnet und die in Base64
// kodierte Datei wieder in das ursprüngliche Dateiformat rückgewantelt('atob()')
var renderContent = function(i,l){
    $('#clickedItem' + l).on("click", function(){
        $("#docContentModal").append("<div class='modal fade' tabindex='-1' role='dialog' id='mymodal" + l + "'" + "><div class='modal-dialog'><div class='modal-content' id='modal-content'><div class='modal-header' id='modal-header" + l +"'" + "><button type='button' class='close' data-dismiss='modal'>&times;</button><h4 class='modal-title'>" + i._source.title + "</h4></div> <div class='modal-body'> <p>"+ atob(i._source.my_attachment._content)  + "</p></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div> </div></div></div>");
    });
};
