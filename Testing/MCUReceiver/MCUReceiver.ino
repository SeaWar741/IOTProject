#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

ESP8266WebServer server;
char* ssid = "Note 10+ Juan Carlos";
char* password = "Juan2000";

void setup(){
  WiFi.begin(ssid,password);
  Serial.begin(9600);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/",handleIndex);
  server.begin();
}

void loop(){
  server.handleClient();
}

void handleIndex(){
  // Send a JSON-formatted request with key "type" and value "request"
  // then parse the JSON-formatted response with keys "gas" and "distance"
  DynamicJsonDocument doc(1024);
  
  double humedad = 0;
  double temperatura = 0;
  double luz = 0;
  double x = 0;
  double y = 0;
  double z = 0;
  double sonido = 0;
  //String lluvia = "";
  double adc_MQ = 0;
  double voltaje = 0;
  double Rs = 0;
  double concentracion = 0;

  
  // Sending the request
  doc["type"] = "request";
  serializeJson(doc,Serial);
  // Reading the response
  boolean messageReady = false;
  String message = "";
  while(messageReady == false) { // blocking but that's ok
    if(Serial.available()) {
      message = Serial.readString();
      Serial.println(message);
      messageReady = true;
    }
  }
  // Attempt to deserialize the JSON-formatted message
  DeserializationError error = deserializeJson(doc,message);
  if(error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  
  //distance = doc["Humedad"];
  //gas = doc["Temperatura"];

  humedad = doc["Humedad"];
  temperatura = doc["Temperatura"];
  luz = doc["Luz"];
  x = doc["X"];
  y = doc["Y"];
  z = doc["Z"];
  sonido = doc["Sonido"];
  String lluvia = doc["Lluvia"];
  adc_MQ = doc["adc"];
  voltaje = doc["voltaje"];
  Rs = doc["Rs"];
  concentracion = doc["ConcentracionGas"];
  
  
  // Prepare the data for serving it over HTTP
  String output = "Humedad: " + String(humedad) + "\n";
  output += "Temperatura: " + String(temperatura)+ "\n";
  output += "Luz: " + String(luz)+ "\n";
  output += "X: " + String(x)+ "\n";
  output += "Y: " + String(y)+ "\n";
  output += "Z: " + String(z)+ "\n";
  output += "Sonido: " + String(sonido)+ "\n";
  output += "Lluvia: " + String(lluvia)+ "\n";
  output += "Adc_MQ: " + String(adc_MQ)+ "\n";
  output += "Voltaje: " + String(voltaje)+ "\n";
  output += "Rs: " + String(Rs)+ "\n";
  output += "concentracion: " + String(concentracion)+ "\n";
  
  // Serve the data as plain text, for example
  server.send(200,"text/plain",output);
}
