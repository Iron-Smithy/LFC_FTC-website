const openButton = document.getElementById('open-sidebar-button')
const navbar = document.getElementById('navbar')

const media = window.matchMedia("(width < 700px)")

media.addEventListener('change', (e) => updateNavbar(e))

function updateNavbar(e){
    const isMobile = e.matches
    if(isMobile){
        navbar.setAttribute('inert', '')
    }
    else{
        // desktop device
        navbar.removeAttribute('inert')
    }
}

function openSidebar(){
    navbar.classList.add('show')
    navbar.removeAttribute('inert')
}

function closeSidebar(){
    navbar.classList.remove('show')
    navbar.setAttribute('inert', '')
}

updateNavbar(media)

