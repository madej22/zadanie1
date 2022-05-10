// ZADANIE 1 - KOD PROGRAMU SERWERA
// Autor: Kacper Madejczyk

// Importowanie modułów koniecznych do działania programu
const { json } = require('express')
const express = require('express')
const moment = require('moment')
const requestIp = require('request-ip')
const XMLHttpRequest = require('xhr2')
const fs = require('fs')
const app = express()

// Kod funkcji czytającej zawartość pliku JSON
function loadJSON(path, success)
{
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4)
        {
            if (xhr.status === 200)
            {
                success(JSON.parse(xhr.responseText))
            }
            else
            {
                console.log('An error occured while trying to read the JSON file...')
            }
        }
    };
    xhr.open('GET', path, true)
    xhr.send()
}

// Ustawienie portu, przygotowanie informacji do logów
const data = moment().format('DD.MM.YYYY, HH:mm:ss')
const author = 'Kacper Madejczyk'
const PORT = process.env.PORT || 3000

// Główne żądanie GET programu serwera
app.get('/', function(req, res)
{
    // Wydobycie adresu IP klienta z żądania
    let ip = requestIp.getClientIp(req).split(':')
    ip = ip[ip.length-1]

    // Załadowanie pliku JSON z informacjami na temat adresu IP klienta
    loadJSON("http://ip-api.com/json/89.186.17.59", function(datetime)
    {
        // Jeżeli udało się zdobyć informacje o adresie IP...
        if (datetime != null)
        {
            // wyznacz datę i godzinę w strefie czasowej klienta, wyznaczonej dzięki adresowi IP
            const clientDatetime = new Date().toLocaleString("pl-PL", { timeZone: datetime['timezone'] })
            // Wyślij informacje o publicznym IP klienta oraz jego lokalnej dacie i godzinie
            const resultString = `Twój adres IP to: ${ip} a data wyznaczona na podstawie strefy czasowej twojego IP to: ${clientDatetime}`
            res.send(resultString)
        } else
        {
            console.log('An error has occurred...')
        }
    });
})

// Oczekiwanie na połączenia na podanym porcie
app.listen(PORT)
{
    // Zestawienie informacji do logów
    const logString = `Data uruchomienia serwera: ${data}`+"\n"+`Autor: ${author}`+"\n"+`Port: ${PORT}`
    // Wysłanie informacji do logów
    fs.writeFile("/home/madej/Pulpit/Informatyka/Chmurki/zadanie1/ip_timezone_app/lastLogs.txt", logString, function(err)
        {
            if(err)
            {
                console.log(err)
            }
            console.log("Informacje zapisane w logach!")
        }
    );
}