const blog = ((content_index) => {
    data = content_index || (site_index_map_object  || undefined)


    const listing = ((target, onclick) => {
        if (!onclick) {
            onclick = "console.log('onclick not provided for blog')"
        }

        if (target) {
            container = target
        }
        let html = "<p>not yet ...</p>";

        (async () => {

            if (!data) {
                let response = await fetch("api/posts.json");
                data = await response.json();
            }

            if (data === undefined) {
                console.log("data is not fetched, cannot show post list")
                html = "<p> data is not fetched, cannot show post list</p>"
            }
            html = '<ul>'
            Object.keys(data).forEach(k =>{
                let d = data[k]
                let item = `<li>
                <div class="post">
                    <h5 class="title" href="#" onclick=${onclick}('${k}') >${d.title}&nbsp;-&nbsp;&nbsp(${d.date})</h5>
                    <p class="intro">${d.intro}</p>
                </div></li>`;
                html += item;
            });
        
            html += "</ul>";
            if (container) {
                container.innerHTML = html;
            }

        })()

        return html
    });

    const single = ((container, key) => {
        (async () => {
            let html = ''
            let content =  data[key]?.content
    
            if (!data[key]?.content) {
                let response = await fetch(key + '.md');
                data[key].content = await response.text();
            }
    
            if (!data[key]?.content) {
                html =  "<p>Failed to get fetch content</p>"
            } else {
                html = `<div>`
                converter = new showdown.Converter({metadata: true});
                html += converter.makeHtml(data[key].content)
                html += `</div>`
            }
            if (container) {
                container.innerHTML = html;
            }
        })()
    })



    return {
        listing, single
    }

})()