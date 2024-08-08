#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include "AudioFileSourcePROGMEM.h"
#include "AudioGeneratorWAV.h"
#include "AudioOutputI2SNoDAC.h"

// Include your audio files
#include "ten.h"
#include "thirty.h"


const char* ssid = "JioFiber2.4Ghz";
const char* password = "12345678";

ESP8266WebServer server(80);

AudioGeneratorWAV *wav;
AudioFileSourcePROGMEM *file;
AudioOutputI2SNoDAC *out;

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Set up the server route
  server.on("/receive_list", HTTP_POST, handleReceiveInput);

  // Start the server
  server.begin();
  Serial.println("HTTP server started");

  // Initialize audio components
  audioLogger = &Serial;
  out = new AudioOutputI2SNoDAC();
  out->SetGain(0.2);
  wav = new AudioGeneratorWAV();
}

void loop() {
  server.handleClient();
  
  if (wav->isRunning()) {
    if (!wav->loop()) wav->stop();
  }
}

void handleReceiveInput() {
  if (server.hasArg("plain") == false) {
    server.send(400, "text/plain", "Body not received");
    return;
  }

   String body = server.arg("plain");
  DynamicJsonDocument doc(2048000);
  
  DeserializationError error = deserializeJson(doc, body);
  
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    server.send(400, "text/plain", "Invalid JSON");
    return;
  }

  JsonArray hexList = doc["hexList"];

  Serial.println("Received hex values:");
  for (JsonVariant value : hexList) {
    String hexValue = value.as<String>();
    Serial.println(hexValue);
    int intValue = strtol(hexValue.c_str(), NULL, 16);
    Serial.println(intValue);
    playAudio(intValue);
    }

  

  server.send(200, "text/plain", "Input received and audio played");
}

void playAudio(int input) {
  const unsigned char* audioData;
  size_t audioSize;

  switch (input) {
    case 16:
      audioData = ten;
      audioSize = sizeof(ten);
      break;
    case 48:
      audioData = thirty;
      audioSize = sizeof(thirty);
      break;
    default:
      Serial.println("Invalid input, no audio played");
      return;
  }

  if (wav->isRunning()) {
    wav->stop();
  }

  file = new AudioFileSourcePROGMEM(audioData, audioSize);
  wav->begin(file, out);
}