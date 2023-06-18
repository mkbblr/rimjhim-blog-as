const route = () => {
    let path = window.location.pathname;
    let root = document.querySelector('.container');

    if (path === "/" || path === "") {
        blog.listing(root, "onNavigate", site_index_map_object)
    } else {
        blog.single(root, path)
    }
}


window.onload = route
window.onpopstate = route

const onNavigate = (pathname) => {
    if (!pathname.startsWith('/')) {
        pathname = '/' + pathname
    }
    window.history.pushState(
        {},
        pathname,
        window.location.origin + pathname
    )
    route()
}


