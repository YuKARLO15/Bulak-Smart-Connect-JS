# How to Install (Frontend)

cd bulak-smart-connect-js </br>
npm install (optional) </br>
npm run dev </br>

# How to Install (Backend)

cd bsc-js-backend </br>
npm install or npm i -g @nestjs/cli (optional) </br>
npm run start </br>

# Firebase Tools (Firebase Emulator)

npm install -g firebase-tools (can be skipped) </br>
cd bsc-js-backend </br>
firebase login </br>
firebase init emulators or firebase init (can be skipped) </br>
firebase emulators:start </br>

install Java JDK from https://www.java.com/en/download/ and https://download.oracle.com/java/23/latest/jdk-23_windows-x64_bin.exe </br>

# serviceAccountKey

serviceAccountKey.json was ignored on git so if needed, just get it on our secure channel and put it on bsc-js-backend\src\config