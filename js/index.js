const route = () => {
    let path = window.location.pathname;
    let root = document.querySelector('.container');

    if (path === "/" || path === "") {
        blog.listing(root, "onNavigate")
    } else if (path.startsWith('/content')) {
        blog.single(root, path)
    } else {
        console.log("Unrecognized route " + path)
    }
}


window.onload = route
window.onpopstate = route

const onNavigate = (pathname) => {
    window.history.pushState(
        {},
        pathname,
        window.location.origin + pathname
    )
    route()
}


