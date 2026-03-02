#!/usr/bin/env node

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');

async function fetchAndHash(urlString) {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(urlString);
            const protocol = parsedUrl.protocol === 'https:' ? https : http;

            protocol.get(urlString, (response) => {
                let data = Buffer.alloc(0);

                response.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });

                response.on('end', () => {
                    const hash = crypto.createHash('sha256').update(data).digest('hex');
                    resolve({
                        hash: hash,
                        url: urlString,
                        contentEncoding: response.headers['content-encoding'] || 'none',
                        contentType: response.headers['content-type'] || 'unknown',
                        contentLength: data.length
                    });
                });
            }).on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node generate-mod-hash.js <url to main.mod.js>');
        process.exit(1);
    }

    const urlString = args[0];
    try {
        new URL(urlString);
    } catch (error) {
        console.error('Error: Invalid URL format');
        console.error(error.message);
        process.exit(1);
    }

    try {
        console.log(`Fetching: ${urlString}`);
        const result = await fetchAndHash(urlString);
        
        console.log('\n=== MOD HASH RESULT ===');
        console.log(`Hash (SHA256): ${result.hash}`);
        console.log(`Content Type: ${result.contentType}`);
        console.log(`Content Encoding: ${result.contentEncoding}`);
        console.log(`File Size: ${result.contentLength} bytes`);
        console.log('=======================\n');
        console.log(result.hash);
    } catch (error) {
        console.error('Error fetching or hashing:', error.message);
        process.exit(1);
    }
}

main();