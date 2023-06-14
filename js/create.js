const data = (() => {
    const fs = require('fs');
    const { stdout } = require('process');
    const readline = require('readline')

    let contentIndex = new Map();
    let basePath = 'content'
    fs.readdir(basePath, null, (err, files) => {
        files.forEach((file) => {
            let filepath = basePath + '/' + file
            const f = readline.createInterface({
                input: fs.createReadStream(filepath),
                output: stdout,
                terminal: false
            });
    
            let index = 0
            let isHeader = false
            let metadata = {} 
    
            f.on('line', (line) => {
                if (line === '---') {
                    isHeader = !isHeader
                    index++
                    if (!isHeader) {
                        path = '/' + filepath.slice(0, -3)
                        contentIndex.set(path, metadata)
                    }
                    return
                }
                if (!isHeader || index > 10) {
                    return
                }
    
                metadata[line.split(/:(.*)/s)[0]?.trim()] = line.split(/:(.*)/s)[1]?.trim()
                index++
            });
        })    
    })

    return {
        contentIndex
    }
})();


(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // console.log(data.contentIndex)

    // let a = []
    // data.contentIndex.forEach((v,k) => {
    //     a.push(v)
    // })
    // console.log(a)

    // txt = JSON.stringify(Object.fromEntries(data.contentIndex), null, 2)

    console.log(`const site_index_map_object = `) 
    console.log(Object.fromEntries(data.contentIndex))

})();

