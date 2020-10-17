#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "FirebaseESP8266.h"
#include <ArduinoJson.h>

ESP8266WebServer server;
char* ssid = "Note 10+ Juan Carlos";
char* password = "Juan2000";

//FIREBASE
#define FIREBASE_HOST "iotproject-446e7.firebaseio.com"
#define FIREBASE_AUTH "JXR7HvjwY9ZXVjaqEYVWIEkalRKKyRddQBtmrzK6"

FirebaseData firebaseData;
FirebaseJson json;

int n = 0;

//Replace with Station ID
String path = "/1/";

//GPS API Google
//Credentials for Google GeoLocation API...
const char* Host = "www.googleapis.com";
String thisPage = "/geolocation/v1/geolocate?key=";
String key = "AIzaSyD9-nx2nAM7jiSRZt8986deF3PmyCSVUfo";

//https certificate fingerPrint
const char fingerprint[] PROGMEM = "31 5C 4F FD 5E 97 FB C6 5B CC 1A 96 1F CF DB 40 E5 BD AD 5E";


int status = WL_IDLE_STATUS;
String jsonString = "{\n";

double latitude    = 0.0;
double longitude   = 0.0;
double accuracy    = 0.0;

int more_text = 1; // set to 1 for more debug output


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

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  server.on("/",handleIndex);
  server.begin();

  //---------------------GPS GET-------------------------------------
  char bssid[6];
  DynamicJsonDocument root(1024); 
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else{
    Serial.print(n);
    Serial.println(" networks found...");

    if (more_text) {
      // Print out the formatted json...
      Serial.println("{");
      Serial.println("\"homeMobileCountryCode\": 334,");  // this is a real UK MCC
      Serial.println("\"homeMobileNetworkCode\": 020,");   // and a real UK MNC
      Serial.println("\"radioType\": \"gsm\",");          // for gsm
      Serial.println("\"carrier\": \"Telcel\",");       // associated with Vodafone
      //Serial.println("\"cellTowers\": [");                // I'm not reporting any cell towers
      //Serial.println("],");
      Serial.println("\"wifiAccessPoints\": [");
      for (int i = 0; i < n; ++i){
        Serial.println("{");
        Serial.print("\"macAddress\" : \"");
        Serial.print(WiFi.BSSIDstr(i));
        Serial.println("\",");
        Serial.print("\"signalStrength\": ");
        Serial.println(WiFi.RSSI(i));
        if (i < n - 1){
          Serial.println("},");
        }
        else{
          Serial.println("}");
        }
      }
      Serial.println("]");
      Serial.println("}");
    }
    Serial.println(" ");
  }
  // now build the jsonString...
  jsonString = "{\n";
  jsonString += "\"homeMobileCountryCode\": 334,\n"; // this is a real UK MCC
  jsonString += "\"homeMobileNetworkCode\": 020,\n";  // and a real UK MNC
  jsonString += "\"radioType\": \"gsm\",\n";        // for gsm
  jsonString += "\"carrier\": \"Telcel\",\n";      // associated with Vodafone
  jsonString += "\"wifiAccessPoints\": [\n";
  for (int j = 0; j < n; ++j){
    jsonString += "{\n";
    jsonString += "\"macAddress\" : \"";
    jsonString += (WiFi.BSSIDstr(j));
    jsonString += "\",\n";
    jsonString += "\"signalStrength\": ";
    jsonString += WiFi.RSSI(j);
    jsonString += "\n";
    if (j < n - 1)
    {
      jsonString += "},\n";
    }
    else
    {
      jsonString += "}\n";
    }
  }
  jsonString += ("]\n");
  jsonString += ("}\n");
  //--------------------------------------------------------------------

  Serial.println("");

  // Create a WiFiClientSecure object.
  WiFiClientSecure client;
  // Set the fingerprint to connect the server.
  client.setInsecure();
  // If the host is not responding,return.
  if(!client.connect(Host, 443)){
    Serial.println("Connection Failed!");
  }
  //Connect to the client and make the api call
  Serial.print("Requesting URL: ");
  Serial.println("https://" + (String)Host + thisPage + "AIzaSyCYNXIYINPmTNIdusMjJloS4_BXSOff1_g");
  Serial.println(" ");
  if (client.connect(Host, 443)) {
    Serial.println("Connected");
    client.println("POST " + thisPage + key + " HTTP/1.1");
    client.println("Host: " + (String)Host);
    client.println("Connection: close");
    client.println("Content-Type: application/json");
    client.println("User-Agent: Arduino/1.0");
    client.print("Content-Length: ");
    client.println(jsonString.length());
    client.println();
    client.print(jsonString);
    delay(500);
  }

  //Read and parse all the lines of the reply from server
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.println(line);
    if (more_text) {
      Serial.print(line);
    }
    latitude    = root["location"]["lat"];
    longitude   = root["location"]["lng"];
    accuracy   = root["accuracy"];
  }

  Serial.println("closing connection");
  Serial.println();
  client.stop();

}

void loop(){
  server.handleClient();
  
  delay(2000);
  
  //----------------------CALL DATA FROM ARDUINO----------------------
  // Send a JSON-formatted request with key "type" and value "request"
  // then parse the JSON-formatted response with keys "gas" and "distance"
  DynamicJsonDocument doc(1024);

  int sensorID = 0;
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
  int potenciometro = 0;

  
  // Sending the request
  doc["type"] = "request";

  //Get led color
  if(Firebase.getInt(firebaseData, path + "Led")){
    Serial.println(firebaseData.stringData());
    doc["Led"] = firebaseData.intData();
  }
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

  sensorID = doc["SensorID"];
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
  potenciometro = doc["Potenciometro"];


  //Write data to Firebase
  Firebase.setInt(firebaseData,  path + "SensorID",sensorID);
  Firebase.setDouble(firebaseData, path + "Humedad",humedad);
  Firebase.setDouble(firebaseData, path + "Temperatura",temperatura);
  Firebase.setDouble(firebaseData, path + "Luz",luz);
  Firebase.setDouble(firebaseData, path + "X",x);
  Firebase.setDouble(firebaseData, path + "Y",y);
  Firebase.setDouble(firebaseData, path + "Z",z);
  Firebase.setDouble(firebaseData, path + "Sonido",sonido);
  Firebase.setString(firebaseData, path + "Lluvia",lluvia);
  Firebase.setDouble(firebaseData, path + "ADC_MQ",adc_MQ);
  Firebase.setDouble(firebaseData, path + "Voltaje",voltaje);
  Firebase.setDouble(firebaseData, path + "Rs",Rs);
  Firebase.setDouble(firebaseData, path + "Concentracion",concentracion);
  Firebase.setInt(firebaseData, path + "Potenciometro",potenciometro);
  Firebase.setInt(firebaseData, path + "GPS/Latitude",latitude);
  Firebase.setInt(firebaseData, path + "GPS/Longitude",longitude);
  Firebase.setInt(firebaseData, path + "GPS/Longitude",accuracy);
  
  //delay(150000);
  
}

void handleIndex(){
  // Send a JSON-formatted request with key "type" and value "request"
  // then parse the JSON-formatted response with keys "gas" and "distance"
  DynamicJsonDocument doc(1024);

  int sensorID = 0;
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
  int potenciometro = 0;

  
  // Sending the request
  doc["type"] = "request";

  //Get led color
  if(Firebase.getInt(firebaseData, path + "Led")){
    Serial.println(firebaseData.stringData());
    doc["Led"] = firebaseData.intData();
  }
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

  sensorID = doc["SensorID"];
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
  potenciometro = doc["Potenciometro"];


  //Write data to Firebase
  Firebase.setInt(firebaseData,  path + "SensorID",sensorID);
  Firebase.setDouble(firebaseData, path + "Humedad",humedad);
  Firebase.setDouble(firebaseData, path + "Temperatura",temperatura);
  Firebase.setDouble(firebaseData, path + "Luz",luz);
  Firebase.setDouble(firebaseData, path + "X",x);
  Firebase.setDouble(firebaseData, path + "Y",y);
  Firebase.setDouble(firebaseData, path + "Z",z);
  Firebase.setDouble(firebaseData, path + "Sonido",sonido);
  Firebase.setString(firebaseData, path + "Lluvia",lluvia);
  Firebase.setDouble(firebaseData, path + "ADC_MQ",adc_MQ);
  Firebase.setDouble(firebaseData, path + "Voltaje",voltaje);
  Firebase.setDouble(firebaseData, path + "Rs",Rs);
  Firebase.setDouble(firebaseData, path + "Concentracion",concentracion);
  Firebase.setInt(firebaseData, path + "Potenciometro",potenciometro);

  // Prepare the data for serving it over HTTP
  String output = "SensorID: " +String(sensorID)+ "\n";
  output += "Humedad: " + String(humedad) + "\n";
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
  output += "Potenciometro: " + String(potenciometro)+ "\n";
  
  //Serve the data as plain text, for example
  server.send(200,"text/plain",output);
}
