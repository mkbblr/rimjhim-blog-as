const blog = (() => {    

    let content_index = undefined
    const converter = new showdown.Converter({metadata: true});

    const singleUI = (k, v) => {
        return  `<div class="post-content">` + converter?.makeHtml(v?.content) + `</div>`;
    }

    const listItemUI = (k, v, onclick) => {
        let img = v.img || "assets/people.svg";
        return `
        <div class="blog-card">
        <div>
            <img src="${img}" class="blog-img" loading="lazy">
        </div>
		<div class="text-overlay">
			<h2 href="#" onclick=${onclick}('${k}')>${v.title.slice(1, -1)}</h2>
			<p>
            <span>${v.date.split(' ')[0]}</span>
            <span href="#" class="read-more" onclick=${onclick}('${k}')> | Read More </span>
            <br>
            <span class="blog-intro">
                ${v.intro.slice(1, -1)}
            </span>    
            </p>
		</div>
	    </div>`

        // return `<article class="card">
        // <header>
        //     <h2 class="title" href="#" onclick=${onclick}('${k}') >
        //         ${v.title}
        //     </h2>
        //     <p>Published: ${v.date}</p>
        // </header>    
        // <p class="intro">${v.intro}</p>
        // </article>`;
    }

    // const listItemUI = (k, v, onclick) => {
    //     return `<div class="card">
    //     <span style="font:bold" class="title" href="#" onclick=${onclick}('${k}') >${v.title}&nbsp;-&nbsp;&nbsp(${v.date})</span>
    //     <span class="intro">${v.intro}</span>
    //     </div>`;
    // }


    const listUI = (data, onclick) => {
        let html = '<div class="cards">'
        Object.keys(data).forEach(k =>{
            html += listItemUI(k, data[k], onclick);
        });
        html += "</div>";
        return html
    }


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
        target.innerHTML = listUI(content_index, onclick)
    });

    const single = (async (target, key, data) => {
        if (!content_index) {
            content_index = data  || undefined
        }        

        if (!target) {
            console.log("single(): target div not provided")
            return
        }
        if (key.startsWith('/')) {
            key = key.slice(1)
        }

        if (!content_index[key]?.content) {
            let response = await fetch(content_index[key]?.src);
            content_index[key].content = await response.text();
        }

        if (!content_index[key]?.content) {
            target.innerHTML =  "<p>Failed to get fetch content</p>"
            return
        }

        target.innerHTML = singleUI(key, content_index[key]);
    })


    return {
        listing, single
    }
})()
