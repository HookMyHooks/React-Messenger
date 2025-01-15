// A utility script to replace hardcoded IP addresses in the given files
// and dynamically update the IP when needed.

const fs = require('fs');
const path = require('path');

class IPReplacer {
    constructor(directory) {
        this.directory = directory;
        this.ipPattern = /http:\/\/192\.168\.0\.108/g; // Match the hardcoded IP
    }

    // Method to replace IP in a single file
    replaceIPInFile(filePath, newIP) {
        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const updatedContent = content.replace(this.ipPattern, `http://${newIP}`);
            fs.writeFileSync(filePath, updatedContent, 'utf-8');
            console.log(`Updated IP in ${filePath}`);
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
        }
    }

    // Method to recursively find and replace IP in all files within a directory
    replaceIPInDirectory(newIP) {
        const processDirectory = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    processDirectory(filePath);
                } else if (stats.isFile()) {
                    this.replaceIPInFile(filePath, newIP);
                }
            }
        };
        processDirectory(this.directory);
    }
}

// Usage Example
const directory = 'D:\\Scoala\\Facultate\\Practica\\NewReactApp\\chat-app\\src'; // Replace with the actual path to your project root
const replacer = new IPReplacer(directory);
const newIP = '192.168.188.26'; // Replace with the desired IP
replacer.replaceIPInDirectory(newIP);
