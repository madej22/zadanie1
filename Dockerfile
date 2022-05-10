# Tworzę obraz od zera
FROM scratch
# Dodaję etykietę ze swoimi danymi
LABEL author="Kacper_Madejczyk"
# Jako obraz bazowy wykorzystuję Alpine
ADD files/alpine-minirootfs-3.15.2-x86_64.tar.gz /
# Instaluję w obrazie pakiety node oraz npm niezbędne do działania programu serwera
RUN apk add --update npm
# Kopiuję zawartość katalogu programu serwera do obrazu
COPY ip_timezone_app /ip_timezone_app/
# Otwieram PORT 3000 na kontenerze, aby można było na nim obsługiwać połączenia
EXPOSE 3000
# Uruchamiam program serwera w kontenerze
CMD node /ip_timezone_app/app.js

# Próbowałem zrobić multi-stage build, żeby obraz był mniejszy, ale mi się nie udało - dramat debila