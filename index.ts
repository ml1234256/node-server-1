import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');
console.log(publicDir);

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const { method, url: path, headers } = request; // path = request.url
    const { pathname, search } = url.parse(path);
    console.log(url.parse(path))

    let filename = pathname.substr(1); //  取第一个字母以后的字符串：/index.html => index.html
    if (filename === '') {
        filename = 'index.html';
    }
    console.log(p.resolve(publicDir, filename));
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            // console.log(error)
            if (error.errno === -4058) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
                    response.end(data);
                });
            } else if (error.errno === -4068) {
                response.statusCode = 403;
                response.end('无权查看目录内容');
            } else {
                response.statusCode = 500;
                response.end('服务器繁忙')
            }
        } else {
            response.end(data);
        }
    });
});


server.listen(8888);