#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>


#define FIREBASE_HOST "iotproject-446e7.firebaseio.com"
#define FIREBASE_AUTH "JXR7HvjwY9ZXVjaqEYVWIEkalRKKyRddQBtmrzK6"
#define WIFI_SSID "ARRIS-99C2"
#define WIFI_PASSWORD  "4AC9DC9A1D1A1147"

FirebaseData firebaseData;
FirebaseJson json;

#define POT A0
#define LED1 D0 //R-Rojo  ... IMPORTANTE: Validar si el LED es de ánodo o de cátodo común
#define LED2 D1 //G-Verde
#define LED3 D2 //B-Azul

int lecturaSensorA0=0;

void setup(){

  Serial.begin(9600);

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println('\n');
    Serial.println("WiFi conectado!");  
    Serial.print("IP address:\t");
    Serial.println(WiFi.localIP()); 

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

}

void loop() {
  if(Firebase.getString(firebaseData, "LED1")){
      //Serial.println(firebaseData.stringData());
      switch(firebaseData.stringData().toInt()) {
        case 1:
                digitalWrite(LED1, LOW);
                digitalWrite(LED2, HIGH);
                digitalWrite(LED3, HIGH);
                break;
        case 2:
               digitalWrite(LED1, HIGH);
               digitalWrite(LED2, LOW);
               digitalWrite(LED3, HIGH);
               break;
        case 3:
               digitalWrite(LED1, HIGH);
               digitalWrite(LED2, HIGH);
               digitalWrite(LED3, LOW);
               break;
        default:
              digitalWrite(LED1, HIGH);
              digitalWrite(LED2, HIGH);
              digitalWrite(LED3, HIGH);
    }
  }
  

    lecturaSensorA0 = analogRead(POT);
    Firebase.setInt(firebaseData, "Pot",lecturaSensorA0);
}
