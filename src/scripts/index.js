(function(){
    const openBtn = document.getElementById('open-sidebar-button');
    const navbar = document.getElementById('navbar');
    const overlay = document.getElementById('overlay');
    const media = window.matchMedia('(max-width:806px)');

    const dropdownToggles = () => Array.from(document.querySelectorAll('.dropdown .dropdown-toggle'));
    const dropdownMenus = () => Array.from(document.querySelectorAll('.dropdown .dropdown-menu'));

    function isMobile() { return media.matches; }

    function openSidebar(){
        navbar.classList.add('show');
        navbar.removeAttribute('aria-hidden');
        overlay.style.display = 'block';
        overlay.setAttribute('aria-hidden','false');
        const first = navbar.querySelector('a,button');
        if (first) first.focus();
    }

    function closeSidebar(){
        navbar.classList.remove('show');
        navbar.setAttribute('aria-hidden','true');
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden','true');
        dropdownMenus().forEach(menu => {
            menu.classList.remove('show');
            menu.style.maxHeight = null;
            const btn = menu.parentElement.querySelector('.dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded','false');
        });
    }

    function toggleSubmenu(e){
        const btn = e.currentTarget;
        const container = btn.closest('.dropdown');
        if (!container) return;
        const menu = container.querySelector('.dropdown-menu');
        if (!menu) return;

        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (isMobile()){
            if (expanded){
                menu.style.maxHeight = null;
                setTimeout(()=> menu.classList.remove('show'), 300);
                btn.setAttribute('aria-expanded','false');
            } else {
                menu.classList.add('show');
                requestAnimationFrame(()=> {
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                });
                btn.setAttribute('aria-expanded','true');
                dropdownToggles().forEach(other => {
                    if (other !== btn){
                        other.setAttribute('aria-expanded','false');
                        const om = other.closest('.dropdown')?.querySelector('.dropdown-menu');
                        if (om) { om.style.maxHeight = null; om.classList.remove('show'); }
                    }
                });
            }
        } else {
            if (expanded){
                menu.classList.remove('show');
                btn.setAttribute('aria-expanded','false');
            } else {
                menu.classList.add('show');
                btn.setAttribute('aria-expanded','true');
            }
        }
    }

    function wireDropdowns(){
        const dropdownItems = Array.from(document.querySelectorAll('.dropdown'));
        dropdownItems.forEach(item => {
            item.removeEventListener('click', dropdownClickHandler);
            item.addEventListener('click', dropdownClickHandler);
            const btn = item.querySelector('.dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    function dropdownClickHandler(e) {
        // If clicked inside submenu links, do nothing (let links work)
        if (e.target.closest('.dropdown-menu')) {
            return;
        }
        e.preventDefault();

        const dropdown = e.currentTarget;
        const btn = dropdown.querySelector('.dropdown-toggle');
        if (!btn) return;

        const menu = dropdown.querySelector('.dropdown-menu');
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        if (isMobile()) {
            if (isExpanded) {
                menu.style.maxHeight = null;
                setTimeout(() => menu.classList.remove('show'), 300);
                btn.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('show');
                requestAnimationFrame(() => {
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                });
                btn.setAttribute('aria-expanded', 'true');
                dropdownToggles().forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        const otherMenu = otherBtn.closest('.dropdown')?.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.style.maxHeight = null;
                            otherMenu.classList.remove('show');
                        }
                    }
                });
            }
        } else {
            if (isExpanded) {
                menu.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('show');
                btn.setAttribute('aria-expanded', 'true');
            }
        }
    }

    document.addEventListener('click', (ev) => {
        const insideDropdown = !!ev.target.closest('.dropdown');
        const insideNavbar = !!ev.target.closest('#navbar');
        const isOpenBtn = ev.target.closest('#open-sidebar-button');

        if (!insideDropdown && !isOpenBtn && !insideNavbar){
            dropdownMenus().forEach(menu => {
                const btn = menu.parentElement.querySelector('.dropdown-toggle');
                if (btn) btn.setAttribute('aria-expanded','false');
                menu.classList.remove('show');
                menu.style.maxHeight = null;
            });
            if (isMobile() && navbar.classList.contains('show')){
                closeSidebar();
            }
        }
    });

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape'){
            if (navbar.classList.contains('show')) closeSidebar();
            dropdownMenus().forEach(menu => {
                const btn = menu.parentElement.querySelector('.dropdown-toggle');
                if (btn) btn.setAttribute('aria-expanded','false');
                menu.classList.remove('show');
                menu.style.maxHeight = null;
            });
        }
    });

    function onMediaChange(){
        if (!isMobile()){
            dropdownMenus().forEach(menu => {
                menu.style.maxHeight = null;
                menu.classList.remove('show');
            });
            overlay.style.display = 'none';
            navbar.classList.remove('show');
            navbar.setAttribute('aria-hidden','false');
        } else {
            navbar.classList.remove('show');
            navbar.setAttribute('aria-hidden','true');
        }
        wireDropdowns();
    }

    if (media.addEventListener) {
        media.addEventListener('change', onMediaChange);
    } else if (media.addListener) {
        media.addListener(onMediaChange);
    }

    onMediaChange();

    openBtn.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    // optional: expose for debugging
    window.closeSidebar = closeSidebar;
})();
