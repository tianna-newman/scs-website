// 页脚组件
function createFooter() {
    return `
        <footer class="footer">
            <div class="footer-bottom">
                <a href="privacy.html">Privacy Policy</a>
                <p>&copy; 2025 Specialist Contracting Services. All rights reserved.</p>
                <a href="https://www.nextmere.com" target="_blank" rel="noopener">
                    Powered by: NextMere
                </a>
            </div>
        </footer>
    `;
}

// 页面加载时自动插入页脚
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = createFooter();
    }
});