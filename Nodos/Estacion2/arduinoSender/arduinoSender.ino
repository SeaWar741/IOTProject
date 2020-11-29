#include "DHT.h"
#include <ArduinoJson.h>
#include "LiquidCrystal.h"

String message = "";//json
bool messageReady = false;

const int IDSensor = 2; //<--Cambiar por el ID correspondiente
const String specialSensorTitle = "Huracanes"; //Nombre del sensor o medicion a realizar

// CONSTRUCTOR DEL OBJETO DHT RECIBE EL PIN EN EL QUE SE CONECTA EL SENSOR
// Y TAMBIEN RECIBE EL TIPO DE SENSOR QUE VAMOS A CONECTAR
DHT dht(5, DHT11);

//Luz
const int lightSensor = A0;

//Acelerometro
const int xpin = A1; // x-axis of the accelerometer
const int ypin = A2; // y-axis
const int zpin = A3; // z-axis

//Lluvia
const int rainSensor = A5; //sensor lluvia

//Sonido
const int soundSensor = A4;

//Potenciometro
const int potenciometroSensor = A7;

//Gas
const int gasSensor = A6;

//colores led
const int redPin = 10;
const int greenPin = 9;
const int bluePin = 8;

//Previous speed
int xP = 0;
int yP = 0;

//AQUI COLOCAR PIN DEL SENSOR ESPECIAL DE LA ESTACION formato -> (medicion)Sensor
//ejemplo: 
//const int fuegoSensor = A8;
//const int fuegoSensor = 9; //<-para digitales

//AQUI COLOCAR PIN DEL ACTUADOR ESPECIAL DE LA ESTACION formato -> especial(actuador)
//ejemplo:
//const int especialMotor = A12;
//const int especialMotor = 12;
int motorPin = 3;

 

//Variables globales 
// lowest and highest sensor readings:
const int sensorMin = 0;     // sensor minimum
const int sensorMax = 1024;  // sensor maximum
//luz
int lightCal;
int lightVal;
//Gas
int volumen;
//potenciometro
int valueP = 0;


void setColor(int redValue, int greenValue, int blueValue){
  analogWrite(redPin,redValue);
  analogWrite(greenPin,greenValue);
  analogWrite(bluePin,blueValue);
}

float toThree(double x){ 
  int d = 0; 
  if((x * pow(10, 3 + 1)) - (floor(x * pow(10, 3))) > 4) d = 1; 
  x = (floor(x * pow(10, 3)) + d) / pow(10, 3); 
  return x; 
} 


String getSpeed(int x, int y){
  String velocity = "";
  //Serial.print("xP: ");
  //Serial.println(xP);
  //Serial.print("x: ");
  //Serial.println(x);
  //Serial.print("yP: ");
  //Serial.println(yP);
  /*Serial.print("y: ");
  Serial.println(y);*/
  if(xP == 0 & yP == 0){
    velocity = "No wind speed";
  } else{
    if(x != xP){
      if((y-yP) > 100){
        velocity = "High wind speed";
      } else{
        velocity = "Moderate wind speed";
      }
    } else{
      velocity = "No wind speed";
    }
  }
  
  return velocity;
}


void closeDoor(){
  //Serial.println("closing door..");
  for(int k = 0; k <= 155; k+=10){
    analogWrite(motorPin, k);
    delay(200);
  }
  for(int k = 150; k >= 0; k-=10){
    analogWrite(motorPin, k);
    delay(200);
  }
  analogWrite(motorPin, 0);
}



void setup() {
  // PREPARAR LA COMUNICACION SERIAL
  Serial.begin(9600);

  lightCal = analogRead(lightSensor);
  
  // PREPARAR LA LIBRERIA PARA COMUNICARSE CON EL SENSOR dht
  dht.begin();

  //coloresLed
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // Motor PIN¡
  pinMode(motorPin, OUTPUT);
}

void loop() {
  // ESPERAR ENTRE MEDICIONES, NECESARIO PARA EL BUEN FUNCIONAMIENTO
  delay(2000);

  //Serial.println("Going through loop...");
  
  //LUZ
  lightVal = analogRead(lightSensor);

  //LLUVIA MAPEADA A 3 VALORES long int map(long int, long int, long int, long int, long int)
  int rainReading = analogRead(rainSensor);
  int range = map(rainReading, sensorMin, sensorMax, 0, 3);
  // LLUVIA UMBRALES:
  String lluvia;
  switch (range) {
     case 0:    // Sensor getting wet
        lluvia = "Flood";
        break;
     case 1:    // Sensor getting wet
        lluvia = "Raining";
        break;
     case 2:    // Sensor dry - To shut this up delete the " Serial.println("Not Raining"); " below.
        lluvia = "Not Raining";
        break;
   }

  
  
  // LEER TEMPERATURA Y HUMEDAD
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();
  float fahrenheit = dht.readTemperature(true);
  float fi = dht.readTemperature(true);
  float hi = dht.computeHeatIndex(fahrenheit, humedad);
  float hiDegC = dht.convertFtoC(hi);

  // REVISAR QUE LOS RESULTADOS SEAN VALORES NUMERICOS VALIDOS, INDICANDO QUE LA COMUNICACION ES CORRECTA

  /*Serial.print("Humedad: ");
  Serial.println(humedad);
  Serial.print("Temperatura: ");
  Serial.println(temperatura);*/
  if (isnan(humedad) || isnan(temperatura)) {
    //Serial.println("Falla al leer el sensor DHT11!");
    humedad = 50;
    temperatura = 25;
  }

  
  

  //GIROSCOPIO
  int x = analogRead(xpin); //read from xpin
  int y = analogRead(ypin); //read from ypin
  int z = analogRead(zpin); //read from zpin
  float zero_G = 512.0; //ADC is 0~1023 the zero g output equal to Vs/2
  float scale = 102.3; //ADXL335330 Sensitivity is 330mv/g
  //Serial.println("Calculating velocity value...");
  String velocityValue = getSpeed(x,y);
  //Serial.print("Velocity: ");
  //Serial.println(velocityValue);
  xP = x;
  yP = y;
  //330 * 1024/3.3/1000
  //Serial.print(((float)x - 331.5)/65*9.8); //print x value on serial monitor
  //Serial.print("\t");
  //Serial.print(((float)y - 329.5)/68.5*9.8); //print y value on serial monitor
  //Serial.print("\t");
  //Serial.print(((float)z - 340)/68*9.8); //print z value on serial monitor
  //Serial.print("\n");

  //SONIDO
  volumen = analogRead(soundSensor); 

  //GAS
  int adc_MQ = analogRead(gasSensor); //Lemos la salida analógica  del MQ
  float voltaje = adc_MQ * (5.0 / 1023.0); //Convertimos la lectura en un valor de voltaje
  float Rs = 1000*((5-voltaje)/voltaje);  //Calculamos Rs con un RL de 1k
  float alcohol = 0.4091*pow(Rs/5463, -1.497); // calculamos la concentración  de gas con la ecuación obtenida.

  //POTENCIOMETRO
  valueP = analogRead(potenciometroSensor);


  //SENSOR ESPECIAL
  //Poner aqui el nombre de la variable y la lectura
  int specialSensorReading = 0;
  /*if(velocityValue == "High wind speed" & lluvia == "Raining"){
    closeDoor();
    specialSensorReading = 1;
  } else{
    analogWrite(motorPin, 0);
    specialSensorReading = 0;
  }*/
  if(velocityValue == "High wind speed"){
    closeDoor();
    specialSensorReading = 1;
  } else{
    analogWrite(motorPin, 0);
    specialSensorReading = 0;
  }

  //SERIAL VERIFICATION
  while(Serial.available()) {
    message = Serial.readString();
    messageReady = true;
  }

  // Only process message if there's one
  if(messageReady) {
    // The only messages we'll parse will be formatted in JSON
    const size_t capacity = JSON_OBJECT_SIZE(20) + 230;
    DynamicJsonDocument doc(capacity);
    // Attempt to deserialize the message
    DeserializationError error = deserializeJson(doc,message);
    if(error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      messageReady = false;
      return;
    }

    if(doc["type"] == "request") {

      if(doc["L"]==0){
        setColor(0,0,0);//off
      }
      if(doc["L"]==1){
        setColor(255,0,0);//red
      }
      if(doc["L"]==2){
        setColor(0,0,255);//green
      }
      if(doc["L"]==3){
       setColor(0,255,0);//blue
      }
      if(doc["L"]==4){
        setColor(255,255,255);//white
      }

      //Aqui trabajar el actuador extra de cada uno
      /*
       * ejemplo
       * if(doc[E]>30){ <-- El doc[extra] funciona como input remoto
       * prender motor
       * }
      */
      
      //Return Response
      doc["type"] = "response";
      
      // Get data from  sensors
      doc["ID"] = IDSensor; // <-- Cambiar por el ID que les toca
      doc["Hum"] = humedad;
      doc["Temp"] = temperatura;
      doc["ST"] = toThree(hiDegC); //Sensacion termica
      doc["Luz"] = lightVal;
      doc["X"] = toThree(((float)x - 331.5)/65*9.8);
      doc["Y"] = toThree(((float)y - 329.5)/68.5*9.8);
      doc["Z"] = toThree(((float)z - 340)/68*9.8);
      doc["Son"] = volumen;
      doc["Lluv"] = lluvia;
      doc["adc"] = adc_MQ;
      doc["volt"] = voltaje;
      doc["Rs"] = toThree(Rs);
      doc["Gas"] = toThree(alcohol);
      doc["Pot"] = valueP;
      doc["Vel"] = velocityValue;
      doc["Esp"] = specialSensorTitle;
      doc["REsp"] = specialSensorReading;

      serializeJson(doc,Serial);
    }
    messageReady = false;
  }
  
}
