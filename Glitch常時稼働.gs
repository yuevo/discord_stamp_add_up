var GLITCH_URL = "GlitchのURLを入れる";
function wakeGlitch(){
 var json = {
   'type':'wake'
 };
 sendGlitch_(GLITCH_URL, json);
}
function sendGlitch_(uri, json){
 var params = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : json,
   'muteHttpExceptions': true
 };
 response = UrlFetchApp.fetch(uri, params);
}