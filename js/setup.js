const setup = (() => {
    const createIndexTask = new Promise(async resolve =>  {
        const fs = require('fs');
        const { stdout } = require('process');
        const readline = require('readline');

        let contentMap = new Map();
        let filePromises = [];
        let basePath = 'content';

        let files = await fs.promises.readdir(basePath);
        
        files.forEach(file => {
            filePromises.push( new Promise(resolveFile => {
                let filepath = basePath + '/' + file
                const rl = readline.createInterface({
                    input: fs.createReadStream(filepath),
                    output: stdout,
                    terminal: false
                });
        
                let currentLineIndex = 0
                let isHeader = false
                let metadata = {} 
                

                rl.on('line', line => {
                    if (line === '---') {
                        isHeader = !isHeader
                        currentLineIndex++
                        if (!isHeader) {
                            metadata['src'] = '/' + filepath
                            path = filepath.split('/')[1].slice(0, -3)
                            contentMap.set(path, metadata)
                        }
                        rl.close()
                        resolveFile()
                        return
                    }
                    if (!isHeader || currentLineIndex > 10) {
                        rl.close()
                        resolveFile()
                        return
                    }
                    metadata[line.split(/:(.*)/s)[0]?.trim()] = line.split(/:(.*)/s)[1]?.trim()
                    currentLineIndex++
                });                
                
            }))
        })

        await Promise.all(filePromises)
        resolve(contentMap)        
    });

    const createIndex = (async () => {
        createIndexTask.then(data => {
           return  new Map([...data].sort((a, b) => {
                return (new Date(b[1]?.date)) - (new Date(a[1]?.date))
            })) 
        }).then(sorted => {
            console.log(`const site_index_map_object = `)
            console.log(Object.fromEntries(sorted))
        }).catch(reason =>  console.log(reason))        
    })    
    createIndex()
})();