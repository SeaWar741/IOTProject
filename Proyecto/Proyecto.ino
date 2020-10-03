#include "DHT.h"

// CONSTRUCTOR DEL OBJETO DHT RECIBE EL PIN EN EL QUE SE CONECTA EL SENSOR
// Y TAMBIEN RECIBE EL TIPO DE SENSOR QUE VAMOS A CONECTAR
DHT dht(5, DHT11);

const int sensorPin = 0;

const int xpin = A1; // x-axis of the accelerometer
const int ypin = A2; // y-axis
const int zpin = A3; // z-axis

// lowest and highest sensor readings:
const int sensorMin = 0;     // sensor minimum
const int sensorMax = 1024;  // sensor maximum
 

int lightCal;
int lightVal;

int volumen;

void setup() {
  // PREPARAR LA COMUNICACION SERIAL
  Serial.begin(9600);
  Serial.println("Prueba del sensores");
  lightCal = analogRead(sensorPin);
  
  // PREPARAR LA LIBRERIA PARA COMUNICARSE CON EL SENSOR
  dht.begin();
}


void loop() {
  // ESPERAR ENTRE MEDICIONES, NECESARIO PARA EL BUEN FUNCIONAMIENTO
  delay(2000);


  //Humedad y temperatura
  lightVal = analogRead(sensorPin);

  // read the sensor on analog A0:
  int sensorReading = analogRead(A5);
  // map the sensor range (four options):
  // ex: 'long int map(long int, long int, long int, long int, long int)'
  int range = map(sensorReading, sensorMin, sensorMax, 0, 3);
  
  // LEER LA HUMEDAD USANDO EL METRODO READHUMIDITY
  float h = dht.readHumidity();
  // LEER LA TEMPERATURA USANDO EL METRODO READTEMPERATURE
  float t = dht.readTemperature();

  // REVISAR QUE LOS RESULTADOS SEAN VALORES NUMERICOS VALIDOS, INDICANDO QUE LA COMUNICACION ES CORRECTA
  if (isnan(h) || isnan(t)) {
    Serial.println("Falla al leer el sensor DHT11!");
    return;
  }
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print(" % ");
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.println(" *C");
  Serial.print("Luz :");
  Serial.print(lightVal);
  Serial.println("lumens");

  //Giroscopio
  int x = analogRead(xpin); //read from xpin
  delay(1); //
  int y = analogRead(ypin); //read from ypin
  delay(1); 
  int z = analogRead(zpin); //read from zpin

  float zero_G = 512.0; //ADC is 0~1023 the zero g output equal to Vs/2
  float scale = 102.3; //ADXL335330 Sensitivity is 330mv/g
  //330 * 1024/3.3/1000
  Serial.print(((float)x - 331.5)/65*9.8); //print x value on serial monitor
  Serial.print("\t");
  Serial.print(((float)y - 329.5)/68.5*9.8); //print y value on serial monitor
  Serial.print("\t");
  Serial.print(((float)z - 340)/68*9.8); //print z value on serial monitor
  Serial.print("\n");

  //Sonido
  volumen = analogRead(A0); 
  Serial.print("Sonido ");
  Serial.print(volumen); 
  Serial.print("\n");

  // Lluvia:
  switch (range) {
     case 0:    // Sensor getting wet
        Serial.println("Flood");
        break;
     case 1:    // Sensor getting wet
        Serial.println("Rain Warning");
        break;
     case 2:    // Sensor dry - To shut this up delete the " Serial.println("Not Raining"); " below.
        Serial.println("Not Raining");
        break;
   }

  //Gas o aire
  int adc_MQ = analogRead(A6); //Lemos la salida analógica  del MQ
  float voltaje = adc_MQ * (5.0 / 1023.0); //Convertimos la lectura en un valor de voltaje
  float Rs=1000*((5-voltaje)/voltaje);  //Calculamos Rs con un RL de 1k
  double alcohol=0.4091*pow(Rs/5463, -1.497); // calculamos la concentración  de gas con la ecuación obtenida.
  //-------Enviamos los valores por el puerto serial------------
  Serial.print("adc:");
  Serial.print(adc_MQ);
  Serial.print("    voltaje:");
  Serial.print(voltaje);
  Serial.print("    Rs:");
  Serial.print(Rs);
  Serial.print("    alcohol:");
  Serial.print(alcohol);
  Serial.println("mg/L");
  
}
