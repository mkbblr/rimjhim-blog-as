const blog = (() => {
    
    let content_index = undefined
    const listing = (async (target, onclick, data) => {
        content_index = data  || undefined

        if (!target) {
            console.log("listing(): target div not provided")
            return
        }
        if (!content_index) {
            console.log("data is not fetched, cannot show post list")
            target.innerHTML = "<p> data is not fetched, cannot show post list</p>"
            return
        }

        onclick = onclick || "console.log('onclick handler not provided')"
        let html = '<ul>'
        Object.keys(content_index).forEach(k =>{
            let d = content_index[k]
            html += `<li>
            <div class="post">
                <h5 class="title" href="#" onclick=${onclick}('${k}') >${d.title}&nbsp;-&nbsp;&nbsp(${d.date})</h5>
                <p class="intro">${d.intro}</p>
            </div></li>`;
        });
        html += "</ul>";
        target.innerHTML = html
    });

    const single = (async (target, key) => {
        if (!target) {
            console.log("single(): target div not provided")
            return
        }

        if (!content_index[key]?.content) {
            let response = await fetch(key + '.md');
            content_index[key].content = await response.text();
        }

        if (!content_index[key]?.content) {
            target.innerHTML =  "<p>Failed to get fetch content</p>"
            return
        }

        let html = `<div>`
        converter = new showdown.Converter({metadata: true});
        html += converter.makeHtml(content_index[key].content)
        html += `</div>`
        target.innerHTML = html;
    })


    return {
        listing, single
    }
})()
