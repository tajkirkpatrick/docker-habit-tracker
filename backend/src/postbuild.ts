var fs = require('fs');
import { join } from 'path';

function log(str: string): void {
    return console.log(`=> ${str}`);
}

const app = () => {
    log('opening main.js');
    fs.readFile('dist/main.js', 'utf8', function (err, data: any) {
        try {
            log('replacing text');
            var formatted = data.replace(
                "app.use(await (await Promise.resolve().then(() => require((0, path_1.join)(__dirname, '../dist/server/entry.mjs')))).handler);",
                "app.use(await (await Promise.resolve().then(() => import((0, path_1.join)(__dirname, '../dist/server/entry.mjs')))).handler);",
            );
            log('replaced text, writing file');
            fs.writeFile('dist/main.js', formatted, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            log('main.js written successfully');
        } catch (error) {
            console.log(error);
        }
    });
    return Promise.resolve();
};

const appModule = () => {
    try {
        log('opening app.module.js');
        fs.readFile('dist/app.module.js', 'utf8', function (err, data: any) {
            log('replacing text');
            var formatted = data.replace(
                'const entry_mjs_1 = require("../dist/server/entry.mjs");',
                'const entry_mjs_1 = import("../dist/server/entry.mjs");',
            );
            log('text replaced, writing to app.module.js');
            fs.writeFile(
                'dist/app.module.js',
                formatted,
                'utf8',
                function (err) {
                    if (err) return console.log(err);
                },
            );
            log('written succesfully');
        });
    } catch (error) {
        console.log(error);
    }
};

app()
    .then(() => appModule())
    .then(() => log('SUCCESS: replaced required imports on .mjs files'));
