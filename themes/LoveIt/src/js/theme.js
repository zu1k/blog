class Util {
    forEach(elements, handler) {
        elements = elements || [];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] != null) {
                handler(elements[i]);
            }
        }
    }

    getScrollTop() {
        return (
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop
        );
    }

    isMobile() {
        return window.matchMedia("only screen and (max-width: 680px)").matches;
    }

    isTocStatic() {
        return window.matchMedia("only screen and (max-width: 960px)").matches;
    }
}

class Theme {
    constructor() {
        this.config = window.config;
        this.data = this.config.data;
        this.isDark = document.body.getAttribute("theme") === "dark";
        this.util = new Util();
        this.newScrollTop = this.util.getScrollTop();
        this.oldScrollTop = this.newScrollTop;
        this.scrollEventSet = new Set();
        this.resizeEventSet = new Set();
        this.switchThemeEventSet = new Set();
        this.clickMaskEventSet = new Set();
        this.menuToggleMobileEventListener = false;
        if (window.objectFitImages) objectFitImages();
    }

    initMenuMobile() {
        const menuToggleMobile = document.getElementById("menu-toggle-mobile");
        const menuMobile = document.getElementById("menu-mobile");
        // If no event listener has been registered yet, add one.
        if (!this.menuToggleMobileEventListener) {
            menuToggleMobile.addEventListener("click", () => {
                document.body.classList.toggle("blur");
                menuToggleMobile.classList.toggle("active");
                menuMobile.classList.toggle("active");
            });
            this.menuToggleMobileEventListener = true;
        }
        // Remove the mask when click on it.
        this._menuMobileOnClickMask = () => {
            menuToggleMobile.classList.remove("active");
            menuMobile.classList.remove("active");
        };
        this.clickMaskEventSet.add(this._menuMobileOnClickMask);
    }

    initSwitchTheme() {
        this.util.forEach(
            document.getElementsByClassName("theme-switch"),
            ($themeSwitch) => {
                $themeSwitch.addEventListener(
                    "click",
                    () => {
                        if (document.body.getAttribute("theme") === "dark")
                            document.body.setAttribute("theme", "light");
                        else document.body.setAttribute("theme", "dark");
                        this.isDark = !this.isDark;
                        window.localStorage &&
                            localStorage.setItem("theme", this.isDark ? "dark" : "light");
                        for (let event of this.switchThemeEventSet) event();
                    },
                    false
                );
            }
        );
    }

    initSearch() {
        const searchConfig = this.config.search;
        const isMobile = this.util.isMobile();
        if (
            !searchConfig ||
            (isMobile && this._searchMobileOnce) ||
            (!isMobile && this._searchDesktopOnce)
        )
            return;

        // Initialize default search config
        const maxResultLength = searchConfig.maxResultLength ?
            searchConfig.maxResultLength :
            10;
        const highlightTag = searchConfig.highlightTag ?
            searchConfig.highlightTag :
            "em";
        const isCaseSensitive = searchConfig.isCaseSensitive ?
            searchConfig.isCaseSensitive :
            false;
        const minMatchCharLength = searchConfig.minMatchCharLength ?
            searchConfig.minMatchCharLength :
            1;
        const findAllMatches = searchConfig.findAllMatches ?
            searchConfig.findAllMatches :
            false;
        const location = searchConfig.location ? searchConfig.location : 0;
        const threshold = searchConfig.threshold ? searchConfig.threshold : 0.3;
        const distance = searchConfig.distance ? searchConfig.distance : 100;
        const ignoreLocation = searchConfig.ignoreLocation ?
            searchConfig.ignoreLocation :
            false;
        const useExtendedSearch = searchConfig.useExtendedSearch ?
            searchConfig.useExtendedSearch :
            false;
        const ignoreFieldNorm = searchConfig.ignoreFieldNorm ?
            searchConfig.ignoreFieldNorm :
            false;
        const suffix = isMobile ? "mobile" : "desktop";
        const header = document.getElementById(`header-${suffix}`);
        const searchInput = document.getElementById(`search-input-${suffix}`);
        const searchToggle = document.getElementById(`search-toggle-${suffix}`);
        const searchLoading = document.getElementById(`search-loading-${suffix}`);
        const searchClear = document.getElementById(`search-clear-${suffix}`);

        if (isMobile) {
            this._searchMobileOnce = true;
            // Turn on the mask when clicking on the search button
            searchInput.addEventListener("focus", () => {
                document.body.classList.add("blur");
                header.classList.add("open");
                console.log("focus");
            });
            // Turn off the everything when clicking on the cancel button
            document
                .getElementById("search-cancel-mobile")
                .addEventListener("click", () => {
                    header.classList.remove("open");
                    document.body.classList.remove("blur");
                    document
                        .getElementById("menu-toggle-mobile")
                        .classList.remove("active");
                    document.getElementById("menu-mobile").classList.remove("active");
                    searchLoading.style.display = "none";
                    searchClear.style.display = "none";
                    this._searchMobile && this._searchMobile.autocomplete.setVal("");
                });
            // Clear the search box when clicking on the clear button
            searchClear.addEventListener(
                "click",
                () => {
                    searchClear.style.display = "none";
                    this._searchMobile && this._searchMobile.autocomplete.setVal("");
                },
                false
            );
            // Remove the mask when click on it or pjax:send
            this._searchMobileOnClickMask = () => {
                header.classList.remove("open");
                searchLoading.style.display = "none";
                searchClear.style.display = "none";
                this._searchMobile && this._searchMobile.autocomplete.setVal("");
            };
            this.clickMaskEventSet.add(this._searchMobileOnClickMask);
        } else {
            this._searchDesktopOnce = true;
            // Turn on the mask when clicking on the search button
            searchToggle.addEventListener("click", () => {
                document.body.classList.add("blur");
                header.classList.add("open");
                searchInput.focus();
            });
            // Clear the search box when clicking on the clear button
            searchClear.addEventListener("click", () => {
                searchClear.style.display = "none";
                this._searchDesktop && this._searchDesktop.autocomplete.setVal("");
            });
            // Toggle search when Ctrl + K is pressed
            document.addEventListener("keydown", (e) => {
                if (e.ctrlKey && e.code === "KeyK") {
                    e.preventDefault();
                    searchToggle.click();
                }
            });
            // Remove the mask when click on it or pjax:send
            this._searchDesktopOnClickMask = () => {
                header.classList.remove("open");
                searchLoading.style.display = "none";
                searchClear.style.display = "none";
                this._searchDesktop && this._searchDesktop.autocomplete.setVal("");
            };
            this.clickMaskEventSet.add(this._searchDesktopOnClickMask);
        }

        // Display the clear button only when the search box is not empty
        searchInput.addEventListener("input", () => {
            if (searchInput.value === "") searchClear.style.display = "none";
            else searchClear.style.display = "inline";
        });

        const initAutosearch = () => {
            const autosearch = autocomplete(
                `#search-input-${suffix}`, {
                hint: false,
                autoselect: true,
                dropdownMenuContainer: `#search-dropdown-${suffix}`,
                clearOnSelected: true,
                cssClasses: {
                    noPrefix: true,
                },
                debug: true,
            }, {
                name: "search",
                source: (query, callback) => {
                    searchLoading.style.display = "inline";
                    searchClear.style.display = "none";
                    const finish = (results) => {
                        searchLoading.style.display = "none";
                        searchClear.style.display = "inline";
                        callback(results);
                    };
                    const search = () => {
                        const results = {};
                        window._index
                            .search(query)
                            .forEach(({
                                item,
                                refIndex,
                                matches
                            }) => {
                                let title = item.title;
                                let content = item.content;
                                matches.forEach(({
                                    indices,
                                    value,
                                    key
                                }) => {
                                    if (key === "content") {
                                        let offset = 0;
                                        for (let i = 0; i < indices.length; i++) {
                                            const substr = content.substring(
                                                indices[i][0] + offset,
                                                indices[i][1] + 1 + offset
                                            );
                                            const tag =
                                                `<${highlightTag}>` + substr + `</${highlightTag}>`;
                                            content =
                                                content.substring(0, indices[i][0] + offset) +
                                                tag +
                                                content.substring(
                                                    indices[i][1] + 1 + offset,
                                                    content.length
                                                );
                                            offset += highlightTag.length * 2 + 5;
                                        }
                                    } else if (key === "title") {
                                        let offset = 0;
                                        for (let i = 0; i < indices.length; i++) {
                                            const substr = title.substring(
                                                indices[i][0] + offset,
                                                indices[i][1] + 1 + offset
                                            );
                                            const tag =
                                                `<${highlightTag}>` + substr + `</${highlightTag}>`;
                                            title =
                                                title.substring(0, indices[i][0] + offset) +
                                                tag +
                                                title.substring(
                                                    indices[i][1] + 1 + offset,
                                                    content.length
                                                );
                                            offset += highlightTag.length * 2 + 5;
                                        }
                                    }
                                });
                                results[item.uri] = {
                                    uri: item.uri,
                                    title: title,
                                    date: item.date,
                                    context: content,
                                };
                            });
                        return Object.values(results).slice(0, maxResultLength);
                    };
                    if (!window._index) {
                        fetch(searchConfig.fuseIndexURL)
                            .then((response) => response.json())
                            .then((data) => {
                                const options = {
                                    isCaseSensitive: isCaseSensitive,
                                    findAllMatches: findAllMatches,
                                    minMatchCharLength: minMatchCharLength,
                                    location: location,
                                    threshold: threshold,
                                    distance: distance,
                                    ignoreLocation: ignoreLocation,
                                    useExtendedSearch: useExtendedSearch,
                                    ignoreFieldNorm: ignoreFieldNorm,
                                    includeScore: false,
                                    shouldSort: true,
                                    includeMatches: true,
                                    keys: ["content", "title"],
                                };
                                window._index = new Fuse(data, options);
                                finish(search());
                            })
                            .catch((err) => {
                                console.error(err);
                                finish([]);
                            });
                    } else finish(search());
                },
                templates: {
                    suggestion: ({
                        title,
                        date,
                        context
                    }) =>
                        `<div><span class="suggestion-title">${title}</span><span class="suggestion-date">${date}</span></div><div class="suggestion-context">${escapeOutput(context)}</div>`,
                    empty: ({
                        query
                    }) =>
                        `<div class="search-empty">${searchConfig.noResultsFound
                        }: <span class="search-query">"${escapeOutput(query)}"</span></div>`,
                    footer: () => {
                        const {
                            searchType,
                            icon,
                            href
                        } = {
                            searchType: "Fuse.js",
                            icon: "",
                            href: "https://fusejs.io/",
                        };
                        return `<div class="search-footer">Search by <a href="${href}" rel="noopener noreffer" target="_blank">${icon} ${searchType}</a></div>`;
                    },
                },
            }
            );
            autosearch.on(
                "autocomplete:selected",
                (_event, suggestion, _dataset, _context) => {
                    window.location.assign(suggestion.uri);
                }
            );
            if (isMobile) this._searchMobile = autosearch;
            else this._searchDesktop = autosearch;
        };

        initAutosearch();
    }

    initDetails() {
        this.util.forEach(
            document.getElementsByClassName("details"),
            ($details) => {
                const $summary = $details.getElementsByClassName("details-summary")[0];
                $summary.addEventListener(
                    "click",
                    () => {
                        $details.classList.toggle("open");
                    },
                    false
                );
            }
        );
    }

    initLightGallery() {
        if (this.config.lightGallery)
            lightGallery(
                document.getElementById("content"),
                this.config.lightGallery
            );
    }

    initHighlight() {
        this.util.forEach(
            document.querySelectorAll(".highlight > pre.chroma"),
            ($preChroma) => {
                const $chroma = document.createElement("div");
                $chroma.className = $preChroma.className;
                const $table = document.createElement("table");
                $chroma.appendChild($table);
                const $tbody = document.createElement("tbody");
                $table.appendChild($tbody);
                const $tr = document.createElement("tr");
                $tbody.appendChild($tr);
                const $td = document.createElement("td");
                $tr.appendChild($td);
                $preChroma.parentElement.replaceChild($chroma, $preChroma);
                $td.appendChild($preChroma);
            }
        );
        this.util.forEach(
            document.querySelectorAll(".highlight > .chroma"),
            ($chroma) => {
                const $codeElements = $chroma.querySelectorAll("pre.chroma > code");
                if ($codeElements.length) {
                    const $code = $codeElements[$codeElements.length - 1];
                    const header = document.createElement("div");
                    header.className = "code-header " + $code.className.toLowerCase();
                    const $title = document.createElement("span");
                    $title.classList.add("code-title");
                    $title.insertAdjacentHTML(
                        "afterbegin",
                        '<i class="icon-angle-circled-right"></i>'
                    );
                    $title.addEventListener(
                        "click",
                        () => {
                            $chroma.classList.toggle("open");
                        },
                        false
                    );
                    header.appendChild($title);
                    const $ellipses = document.createElement("span");
                    $ellipses.insertAdjacentHTML(
                        "afterbegin",
                        '<i class="icon-ellipsis"></i>'
                    );
                    $ellipses.classList.add("ellipses");
                    $ellipses.addEventListener(
                        "click",
                        () => {
                            $chroma.classList.add("open");
                        },
                        false
                    );
                    header.appendChild($ellipses);
                    const $copy = document.createElement("span");
                    $copy.insertAdjacentHTML("afterbegin", '<i class="icon-copy"></i>');
                    $copy.classList.add("copy");
                    const code = $code.innerText;
                    if (
                        this.config.code.maxShownLines < 0 ||
                        code.split("\n").length < this.config.code.maxShownLines + 2
                    )
                        $chroma.classList.add("open");
                    if (this.config.code.copyTitle) {
                        $copy.setAttribute("data-clipboard-text", code);
                        $copy.title = this.config.code.copyTitle;
                        const clipboard = new ClipboardJS($copy);
                        header.appendChild($copy);
                    }
                    $chroma.insertBefore(header, $chroma.firstChild);
                }
            }
        );
    }

    initTable() {
        this.util.forEach(document.querySelectorAll(".content table"), ($table) => {
            const $wrapper = document.createElement("div");
            $wrapper.className = "table-wrapper";
            $table.parentElement.replaceChild($wrapper, $table);
            $wrapper.appendChild($table);
        });
    }

    initHeaderLink() {
        for (let num = 1; num <= 6; num++) {
            this.util.forEach(
                document.querySelectorAll(".single .content > h" + num),
                (header) => {
                    header.classList.add("headerLink");
                    header.insertAdjacentHTML(
                        "afterbegin",
                        `<a href="#${header.id}" class="header-mark"></a>`
                    );
                }
            );
        }
    }

    initToc() {
        const $tocCore = document.getElementById("TableOfContents");
        if ($tocCore === null) return;
        if (
            document.getElementById("toc-static").getAttribute("kept") ||
            this.util.isTocStatic()
        ) {
            const $tocContentStatic = document.getElementById("toc-content-static");
            if ($tocCore.parentElement !== $tocContentStatic) {
                $tocCore.parentElement.removeChild($tocCore);
                $tocContentStatic.appendChild($tocCore);
            }
            if (this._tocOnScroll) this.scrollEventSet.delete(this._tocOnScroll);
        } else {
            const $tocContentAuto = document.getElementById("toc-content-auto");
            if ($tocCore.parentElement !== $tocContentAuto) {
                $tocCore.parentElement.removeChild($tocCore);
                $tocContentAuto.appendChild($tocCore);
            }
            const $toc = document.getElementById("toc-auto");
            const $page = document.getElementsByClassName("page")[0];
            const rect = $page.getBoundingClientRect();
            $toc.style.left = `${rect.left + rect.width + 20}px`;
            $toc.style.maxWidth = `${$page.getBoundingClientRect().left - 40}px`;
            $toc.style.visibility = "visible";
            const $tocLinkElements = $tocCore.querySelectorAll("a:first-child");
            const $tocLiElements = $tocCore.getElementsByTagName("li");
            const headerLinkElements = document.getElementsByClassName("headerLink");
            const headerIsFixed =
                document.body.getAttribute("header-desktop") !== "normal";
            const headerHeight =
                document.getElementById("header-desktop").offsetHeight;
            const TOP_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
            const minTocTop = $toc.offsetTop;
            const minScrollTop =
                minTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
            this._tocOnScroll =
                this._tocOnScroll ||
                (() => {
                    const footerTop = document.getElementById("post-footer").offsetTop;
                    const maxTocTop = footerTop - $toc.getBoundingClientRect().height;
                    const maxScrollTop =
                        maxTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
                    if (this.newScrollTop < minScrollTop) {
                        $toc.style.position = "absolute";
                        $toc.style.top = `${minTocTop}px`;
                    } else if (this.newScrollTop > maxScrollTop) {
                        $toc.style.position = "absolute";
                        $toc.style.top = `${maxTocTop}px`;
                    } else {
                        $toc.style.position = "fixed";
                        $toc.style.top = `${TOP_SPACING}px`;
                    }

                    this.util.forEach($tocLinkElements, ($tocLink) => {
                        $tocLink.classList.remove("active");
                    });
                    this.util.forEach($tocLiElements, ($tocLi) => {
                        $tocLi.classList.remove("has-active");
                    });
                    const INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
                    let activeTocIndex = headerLinkElements.length - 1;
                    for (let i = 0; i < headerLinkElements.length - 1; i++) {
                        const thisTop = headerLinkElements[i].getBoundingClientRect().top;
                        const nextTop =
                            headerLinkElements[i + 1].getBoundingClientRect().top;
                        if (
                            (i == 0 && thisTop > INDEX_SPACING) ||
                            (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)
                        ) {
                            activeTocIndex = i;
                            break;
                        }
                    }
                    if (activeTocIndex !== -1) {
                        $tocLinkElements[activeTocIndex].classList.add("active");
                        let $parent = $tocLinkElements[activeTocIndex].parentElement;
                        while ($parent !== $tocCore) {
                            $parent.classList.add("has-active");
                            $parent = $parent.parentElement.parentElement;
                        }
                    }
                });
            this._tocOnScroll();
            this.scrollEventSet.add(this._tocOnScroll);
        }
    }

    initMermaid() {
        const $mermaidElements = document.getElementsByClassName("mermaid");
        if ($mermaidElements.length) {
            mermaid.initialize({
                startOnLoad: false,
                theme: "null",
            });
            this.util.forEach($mermaidElements, ($mermaid) => {
                mermaid.mermaidAPI.render(
                    "svg-" + $mermaid.id,
                    this.data[$mermaid.id],
                    (svgCode) => {
                        $mermaid.insertAdjacentHTML("afterbegin", svgCode);
                    },
                    $mermaid
                );
            });
        }
    }

    initComment() {
        if (this.config.comment) {
            if (this.config.comment.giscus) {
                const giscusConfig = this.config.comment.giscus;
                const script = document.createElement("script");
                script.src = "https://giscus.app/client.js";
                script.type = "text/javascript";
                script.setAttribute("data-repo", giscusConfig.repo);
                script.setAttribute("data-repo-id", giscusConfig.repoid);
                script.setAttribute("data-category", giscusConfig.category);
                script.setAttribute("data-category-id", giscusConfig.categoryid);
                script.setAttribute("data-mapping", giscusConfig.mapping);
                script.setAttribute("data-reactions-enabled", "1");
                script.setAttribute("data-emit-metadata", "0");
                script.setAttribute("data-lang", "zh-CN");
                script.setAttribute("data-theme", this.isDark ? "dark" : "light");
                script.crossOrigin = "anonymous";
                script.async = true;
                document.getElementById("giscus").appendChild(script);
                this._giscusOnSwitchTheme =
                    this._giscusOnSwitchTheme ||
                    (() => {
                        const message = {
                            setConfig: {
                                theme: this.isDark ? "dark" : "light",
                            },
                        };
                        const iframe = document.querySelector("iframe.giscus-frame");
                        if (!iframe) return;
                        iframe.contentWindow.postMessage({
                            giscus: message,
                        },
                            "https://giscus.app"
                        );
                    });
                this.switchThemeEventSet.add(this._giscusOnSwitchTheme);
            }
        }
    }

    initSmoothScroll() {
        if (SmoothScroll)
            new SmoothScroll('[href^="#"]', {
                speed: 300,
                speedAsDuration: true,
                header: "#header-desktop",
            });
    }

    onScroll() {
        const headers = [];
        if (document.body.getAttribute("header-desktop") === "auto")
            headers.push(document.getElementById("header-desktop"));
        if (document.body.getAttribute("header-mobile") === "auto")
            headers.push(document.getElementById("header-mobile"));
        if (document.getElementById("comments")) {
            const $viewComments = document.getElementById("view-comments");
            $viewComments.href = `#comments`;
            $viewComments.style.display = "block";
        }
        const $fixedButtons = document.getElementById("fixed-buttons");
        const ACCURACY = 20,
            MINIMUM = 100;
        window.addEventListener(
            "scroll",
            () => {
                this.newScrollTop = this.util.getScrollTop();
                const scroll = this.newScrollTop - this.oldScrollTop;
                const isMobile = this.util.isMobile();
                this.util.forEach(headers, (header) => {
                    if (scroll > ACCURACY) {
                        header.classList.remove("fadeInDown");
                    } else if (scroll < -ACCURACY) {
                        header.classList.remove("fadeOutUp");
                    }
                });
                if (this.newScrollTop > MINIMUM) {
                    if (isMobile && scroll > ACCURACY) {
                        $fixedButtons.classList.remove("fadeIn");
                    } else if (!isMobile || scroll < -ACCURACY) {
                        $fixedButtons.style.display = "block";
                        $fixedButtons.classList.remove("fadeOut");
                    }
                } else {
                    if (!isMobile) {
                        $fixedButtons.classList.remove("fadeIn");
                    }
                    $fixedButtons.style.display = "none";
                }
                for (let event of this.scrollEventSet) event();
                this.oldScrollTop = this.newScrollTop;
            },
            false
        );
    }

    onResize() {
        window.addEventListener(
            "resize",
            () => {
                if (!this._resizeTimeout) {
                    this._resizeTimeout = window.setTimeout(() => {
                        this._resizeTimeout = null;
                        for (let event of this.resizeEventSet) event();
                        this.initToc();
                        this.initMermaid();
                        this.initSearch();
                    }, 100);
                }
            },
            false
        );
    }

    onClickMask() {
        document.getElementById("mask").addEventListener(
            "click",
            () => {
                for (let event of this.clickMaskEventSet) event();
                document.body.classList.remove("blur");
            },
            false
        );
    }

    removeElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    checkMobile() {
        if (this.util.isMobile()) {
            this.removeElementsByClass("desktop");
            this.initMenuMobile();
        } else {
            this.removeElementsByClass("mobile")
        }
    }

    init() {
        try {
            this.checkMobile();
            this.initSwitchTheme();
            this.initSearch();
            this.initDetails();
            this.initLightGallery();
            this.initHighlight();
            this.initTable();
            this.initHeaderLink();
            this.initSmoothScroll();
            this.initMermaid();
        } catch (err) {
            console.error(err);
        }

        window.setTimeout(() => {
            this.initToc();
            this.initComment();
            this.onScroll();
            this.onResize();
            this.onClickMask();
        }, 100);
    }
}

const themeInit = () => {
    const theme = new Theme();
    theme.init();
};

if (document.readyState !== "loading") {
    themeInit();
} else {
    document.addEventListener("DOMContentLoaded", themeInit, false);
}

function escapeOutput(toOutput) {
    return toOutput.replace(/\&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&#x27')
        .replace(/\//g, '&#x2F');
}