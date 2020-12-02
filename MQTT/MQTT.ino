// Este código funciona con la siguiente configuración:
//    Board support API esp8266 (by ESP8266 Community) version 2.5.2

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
//89669AFDE93C31C

//#define WIFI_SSID "Tec-IoT"
//#define WIFI_PASSWORD "PreguntarADeptoTI"
#define WIFI_SSID "iPhone abraham"
#define WIFI_PASSWORD "12345677"

#define SENSOR_A0 A0
#define LED1 D0 //R-Rojo  ... IMPORTANTE: Validar si el LED es de ánodo o de cátodo común
#define LED2 D1 //G-Verde
#define LED3 D2 //B-Azul

const char* mqtt_server = "broker.hivemq.com";
const char *channelTopic = "myIoT4RiSa";
 
WiFiClient espClient;
PubSubClient client(espClient);

long tiempoAnterior = 0;
char msg[50];
int lecturaSensorA0 = 0;
int umbral=50; //Este valor define el umbral abajo del que se enviará un mensaje al "broker"

void setup_wifi() {
    delay(100);
    Serial.println();
    Serial.print("macAddress: ");
    Serial.println(WiFi.macAddress());
    //Iniciar por conectar con la red WiFi
    Serial.print("Conectando WiFI --> ");
    Serial.println(WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi conectado!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
} // End setup_wifi()
 
void callback(char* topic, byte* payload, unsigned int length) {
    char *cstring = (char *) payload;
    cstring[length] = '\0';    // Adds a terminate terminate to end of string based on length of current payload
    Serial.println(cstring);
    if (cstring[1]=='R') {
    } else if (cstring[1]=='G') {
    } else if (cstring[1]=='B') {
    }
    switch(cstring[1]) {
        case 'G':
                  Serial.println("\tVerde");
                  digitalWrite(LED1,LOW);
                  digitalWrite(LED2,HIGH);
                  digitalWrite(LED3,HIGH);
                  break;
        case 'B':
                  Serial.println("\tAzul");
                  digitalWrite(LED1,LOW); //LOW
                  digitalWrite(LED2,HIGH); //HIGH
                  digitalWrite(LED3,LOW); //LOW
                  break;
        case 'R':
                  Serial.println("\tRojo");
                  digitalWrite(LED1,HIGH);
                  digitalWrite(LED2,HIGH);
                  digitalWrite(LED3,LOW);
                  break;
        default:  //Sin no fué ninguna de las anteriores entonces hacemos nada
                  break;
    }
}  // End callback(...)
 
void reconnect() {
    // Ciclarse hasta lograr reconexión con "broker"
    while (!client.connected()) {
        Serial.print("Intentando conexión MQTT ...");
        // Create a random client ID
        String clientId = "ESP8266Client-";
        clientId += String(random(0xffff), HEX);
        //Intentar reconexión ...
        // ... en caso de que el "broker" tenga clientID, username y password
        // ... cambiar la siguiente línea por --> if (client.connect(clientId,userName,passWord))
        if (client.connect(clientId.c_str())) {
            Serial.println("Conectado al 'broker' MQTT!!!");
            //Ya conectado al "borker" MQTT suscribirse al tópico
            client.subscribe(channelTopic);
        } else {
            Serial.print("Error de conexión, rc=");
            Serial.print(client.state());
            Serial.println(" ... reintentando en 5 seg.");
            // Esperar 6 segundos para el próximo intento de conexión
            delay(6000);
        }
    }
} //end reconnect()
 
void setup() {
    pinMode(LED1, OUTPUT);
    pinMode(LED2, OUTPUT);
    pinMode(LED3, OUTPUT);
    Serial.begin(9600);
    setup_wifi();
    client.setServer(mqtt_server, 1883);//Usando el puerto 1883, estándar en MQTT
    client.setCallback(callback);
}
 
void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
    long ahora = millis();  //Obtener el reloj del sistema en milisegundos
    //Validar (por control de tiempo) si ya pasaron 0.5 segundos desde el reporte anterior
    if (ahora - tiempoAnterior > 500) {
        tiempoAnterior = ahora;
        int lecturaSensorA0=analogRead(SENSOR_A0);
        String msg="The resistance value is: ";
        msg= msg+lecturaSensorA0;
        if (lecturaSensorA0>umbral) //Este 'if' funciona, pero su construcción no cumple con Codigo-Seguro, ¿por qué?
            msg="0: "+msg;    //Cuando el valor del sensor>umbral
        else
            msg="1: "+msg;    //Cuando el valor del sensor<=umbral
        char message[58];
        msg.toCharArray(message,58);
        Serial.println(message);

        if (lecturaSensorA0<umbral) { //publish sensor data to MQTT broker
            client.publish(channelTopic, message);
        }
    }
}  //End loop
