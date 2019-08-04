import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import { startDataCollector, getFileName, FILE_EXTENSION, CONTENT_TYPE } from './data-collector';

startDataCollector();

const port = 4000;

function downloadFile(res: http.ServerResponse, fileName: string): void {
    const pathToFile = path.join(__dirname, '..', 'data', fileName);
    if (fs.existsSync(pathToFile)) {
        fs.readFile(
            pathToFile,
            (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if (err) {
                    res.end(err.message);
                } else {
                    res.writeHead(200, {'Content-Type': CONTENT_TYPE});
                    res.end(data);
                }
            }
        )
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`File ${fileName} does not exist.`);
    }
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url && req.url === '/api') {
        fs.readdir(
            path.join(__dirname, '..', 'data'),
            (err: NodeJS.ErrnoException | null, files: string[]) => {
                if (err) {
                    res.end(err.message);
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
                    res.write('<!doctype html>');
                    res.write('<html>');
                    res.write('<head><meta charset="utf-8"><title>sensor-am2302-history</title></head>');
                    res.write('<body>');

                    res.write('<h3>Data</h3>');
                    for (const file of files) {
                        const resource = file.replace(FILE_EXTENSION, '');
                        res.write(`<a href="/${resource}">${resource}</a><br>`);
                    }

                    res.write('</body>');
                    res.write('</html>');
                    res.end();
                }
            }
        )
    } else if (req.url && req.url === '/') {
        downloadFile(res, getFileName());
    } else if (req.url) {
        const fileName = req.url.replace('/', '') + FILE_EXTENSION;
        downloadFile(res, fileName);
    }
});

server.listen(port, () => console.log(`Server is running on port ${port}...`));
