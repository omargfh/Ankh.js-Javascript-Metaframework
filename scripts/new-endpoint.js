const fs = require('fs');
const nunjucks = require('nunjucks');

function main() {
    if (process.argv.length < 3) {
        console.error('Bad usage.');
        process.exit(1);
    }
    let targetPath = "./src/pages/api/" + process.argv[2].split('.')[0] + '.ts'
    let tableName = process.argv.length === 3 ? process.argv[2] : process.argv[3]
    let SQL = !process.argv.slice(4).includes('--no-sql');
    fs.readFile(__dirname + "/src/endpoint.ts.jinja2", 'utf-8', (err, data) => {
        if (err) {
            console.error("Corrupted or missing files.")
            process.exit(2);
        }
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.renderString(data, { table: tableName, SQL: SQL })
        fs.writeFile(targetPath, result, 'utf-8', (err) => {
            if (err) {
                console.error("An error has occurred.");
                process.exit(3);
            }
        })
    })
}

main();
