# How to Install (Frontend)

cd bulak-smart-connect-js </br>
npm install (optional) </br>
npm run dev </br>

# How to Install (Backend)

cd bsc-js-backend </br>
npm install or npm i -g @nestjs/cli (optional) </br>
npm run start </br>

Test at http://localhost:3000/ </br>

# Firebase Tools (Firebase Emulator)

npm install -g firebase-tools (can be skipped) </br>
cd bsc-js-backend </br>
firebase login </br>
firebase init emulators or firebase init (can be skipped) </br>
firebase emulators:start </br>

install Java JDK from https://www.java.com/en/download/ and https://download.oracle.com/java/23/latest/jdk-23_windows-x64_bin.exe </br>

# serviceAccountKey

serviceAccountKey.json was ignored on git so if needed, just get it on our secure channel and put it on bsc-js-backend\src\config </br>

# npm run dev

npm run dev on the frontend folder now runs concurrently, meaning React, NestJs, & Firebase Emulator runs simultaneously </br>

If you want to run it on its default behavior, go to package.json on the folder, C:\Users\YuKARLO15\Desktop\Programming_Codes\Bulak-Smart-Connect-JS\bulak-smart-connect-js and change the dev under the scripts into "dev": "vite",