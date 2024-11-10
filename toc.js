// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">Warframe builds</li><li class="chapter-item expanded "><a href="saryn_prime_nuke.html"><strong aria-hidden="true">1.</strong> Saryn prime nuke</a></li><li class="chapter-item expanded "><a href="mirage_prime_nuke.html"><strong aria-hidden="true">2.</strong> Mirage prime nuke</a></li><li class="chapter-item expanded "><a href="mirage_prime_dmg.html"><strong aria-hidden="true">3.</strong> Mirage prime dmg</a></li><li class="chapter-item expanded "><a href="wisp_prime_strength.html"><strong aria-hidden="true">4.</strong> Wisp prime strength</a></li><li class="chapter-item expanded "><a href="floating_zephyr_prime.html"><strong aria-hidden="true">5.</strong> Zephyr Prime Floating</a></li><li class="chapter-item expanded "><a href="khora_prime_loot.html"><strong aria-hidden="true">6.</strong> Khora Prime Loop</a></li><li class="chapter-item expanded affix "><li class="part-title">Secondary builds</li><li class="chapter-item expanded "><a href="epitaph_prime_status.html"><strong aria-hidden="true">7.</strong> Epitaph prime status</a></li><li class="chapter-item expanded affix "><li class="part-title">Melee</li><li class="chapter-item expanded "><a href="harmony.html"><strong aria-hidden="true">8.</strong> Harmony</a></li><li class="chapter-item expanded affix "><li class="part-title">TODO</li><li class="chapter-item expanded "><a href="shedu.html"><strong aria-hidden="true">9.</strong> Shedu</a></li><li class="chapter-item expanded "><a href="ash_prime_circuit.html"><strong aria-hidden="true">10.</strong> Ash prime circuit</a></li><li class="chapter-item expanded "><a href="chroma_prime_eidolon.html"><strong aria-hidden="true">11.</strong> Chroma Prime Eidolon</a></li><li class="chapter-item expanded "><a href="harrow_prime_support.html"><strong aria-hidden="true">12.</strong> Harrow Prime Support</a></li><li class="chapter-item expanded "><a href="hyldrin_prime.html"><strong aria-hidden="true">13.</strong> Hyldrin prime</a></li><li class="chapter-item expanded "><a href="nidus_prime_specter.html"><strong aria-hidden="true">14.</strong> Nidus prime Specter</a></li><li class="chapter-item expanded "><a href="volt_prime_circuit.html"><strong aria-hidden="true">15.</strong> Volt prime circuit</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
