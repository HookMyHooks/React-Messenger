React-Messenger


1. Introduction
- This web application is designed to work as a chatting system based on friends list on a local server.


2. Basic Description
- Using a local server connected to a database, a number of users connected to the server can see their online
status and send/receive/accept friend requests. Based on the friend list, the user can select a friend to chat with. 



3. Technologies used
- React and JavaScript for server and front-end
- CSS for styling
- PSQL for database

4. Installation steps:
-> Make sure you have installed NodeJs and PostgreSQL
-> Download the repo
-> After unzipping the repository, use the restore method for the database 'local_messenger.sql' in PostgreSQL
-> Enter \NewReactApp\server
-> Open a command prompt / powershell prompt and type 'npm install' 
-> Then type 'node index.js' -> that will open the server
-> Go to \NewReactApp\chat-app\src
-> Open 'ipconfig.js' as a text file
-> Modify line 44: const directory = 'D:\\Scoala\\Facultate\\Practica\\NewReactApp\\chat-app\\src'; -> Replace with the actual path to your project root
-> Modify line 46: const newIP = '192.168.188.26'; // Replace with the desired IP -> tipically found under 'IPv4 Address' in 'ipconfig' command prompt line
-> Go to \NewReactApp\chat-app
-> Open a command prompt in that location
-> Type 'npm install' to install dependencies
-> Type 'npm start' and wait for it to open the webpage. 



6. Workflow
- The user opens the page (typically by typing "http://your_ip:port/" where your_ip and port are mentioned in the console
- They will be needed to login/register to use the page
- After login/register, they will have access to the page "/friends" where they will be able to see other online users
- The user can add the online user to their friends to which the receiver can delete or accept the friend request
- If the receiver has accepted, they will be able to chat between themselves by clicking a button next to the respective user
