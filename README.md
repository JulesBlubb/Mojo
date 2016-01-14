# Mojo 

- Die Auslieferung statischer Daten (CSS/ JS/ HTML) ist ihnen überlassen,
  ob sie Node.js mit Express.js erweitern oder auch nur auf einem Apache
  laufen lassen.

- der Index in elasticsearch muss manuel erstellt werden:
  in der Komandozeile Pfad auswählen und den Befehl:

	-curl -XPUT 'http://localhost:9200/documentsearch' '{
    "mappings": {
        "doc": {
            "properties": {
                "my_attachment": { "type": "attachment" }}}}}'
  
  gegebenfalls auch zum löschen des Index den Befehl mit: 
  
  -curl -XDELETE 'http://localhost:9200/documentsearch/'
 
 ausführen.

- Node Starten: in der Konsole den Befehl "node" ausführen, falls Befehl nicht bekannt, muss node.js installiert werden.(siehe https://nodejs.org/en) 
- Node Server Starten: in der Konsole in den Pfad der Projectdatei "*/server.js" gehen und den Befehl "node server.js" ausführen.

- Browser öffnen, und die Adresse: "http://localhost:8000/" aufrufen.(Port:8000 ist default mäßig im Projekt eingestellt)

Vielen Dank und viel Spaß beim testen,

beste Grüße, Team Mojo Rojo
