// 导航栏组件
function createNavbar(activePage) {
    return `
    <nav class="navbar">
    <div class="container">
        <div class="nav-brand">
            <a href="index.html" class="nav-logo-text">
                <div class="nav-logo-row-top">
                    <span class="nav-logo-scs">SCS</span>
                    <div class="nav-logo-taglines">
                        <span>ENVIRONMENTAL</span>
                        <span>SURFACE</span>
                        <span>PREPARATION</span>
                    </div>
                </div>
                <div class="nav-logo-bottom">
                    SPECIALIST CONTRACTING SERVICE Pty Ltd
                </div>
            </a>
        </div>

        <ul class="nav-menu">
    <li><a href="index.html" class="${activePage === 'index.html' ? 'active' : ''}">Home</a></li>
    <li><a href="services.html" class="${activePage === 'services.html' ? 'active' : ''}">Services</a></li>
    <li><a href="about.html" class="${activePage === 'about.html' ? 'active' : ''}">About</a></li>
    <li><a href="gallery.html" class="${activePage === 'gallery.html' ? 'active' : ''}">Gallery</a></li>
    <li><a href="contact.html" class="${activePage === 'contact.html' ? 'active' : ''}">Contact</a></li>
</ul>
    </div>
</nav>
    `;
}

// 页面加载时自动插入导航栏
document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        // 获取当前页面文件名
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navbarPlaceholder.innerHTML = createNavbar(currentPage);
    }
});