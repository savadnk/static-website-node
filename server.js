let dotenv = require('dotenv')
dotenv.config();
let http = require('http')
let fs = require('fs')
let path = require('path')
let mime = require('mime-types')
let url = require('url')

let port = process.env.PORT || 3000;
let public_dir = path.resolve(process.env.PUBLIC_DIR || './public');

let server = http.createServer((req, res) => {
    let requestedPath = req.url === '/' ? '/index.html' : req.url;
    let filePath = path.join(public_dir, requestedPath);
    // let filrpath2 = path.join(__dirname, 'public', decodeURIComponent(requestedPath))

    if (!filePath.startsWith(public_dir)) {
        res.writeHead(403, { 'content-type': 'text/plain' })
        res.end('403-Forbidden')
        return;
    }

    let parsed = url.parse(req.url, true)
    let pathname = parsed.pathname

    if (pathname === '/about.html' && req.method === GET) {
        res.writeHead(200, { contentType: 'text/html' })
        res.end('this is about page')
    }

    try {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'content-type': 'text/plain' })
                res.end("File Not Found")
            } else {
                let contentType = mime.lookup(filePath) || 'application/octet-stream';
                res.writeHead(200, { 'content-type': contentType })
                res.end(data)
            };
        });
    } catch (err) {
        console.log('error message :', err)
    };


});

server.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})
