<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />

  <xsl:template match="/">
    <xsl:variable name="is-atom" select="boolean(/atom:feed)" />
    <xsl:variable name="feed-title" select="(/rss/channel/title | /atom:feed/atom:title)[1]" />
    <xsl:variable name="feed-description" select="(/rss/channel/description | /atom:feed/atom:subtitle)[1]" />
    <xsl:variable name="site-url" select="(/rss/channel/link | /atom:feed/atom:link[@rel='alternate'][1]/@href)[1]" />
    <xsl:variable name="feed-url" select="(/rss/channel/atom:link[@rel='self']/@href | /atom:feed/atom:link[@rel='self']/@href)[1]" />

    <html lang="zh-CN" data-theme="light">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>
          <xsl:value-of select="$feed-title" />
          <xsl:text> · </xsl:text>
          <xsl:choose>
            <xsl:when test="$is-atom">Atom</xsl:when>
            <xsl:otherwise>RSS</xsl:otherwise>
          </xsl:choose>
        </title>
        <style type="text/css">
          :root {
            color-scheme: light;
            --page: #f5f3ee;
            --raised: #fbfaf6;
            --text: #1b1a17;
            --soft: #55524a;
            --muted: #8b877d;
            --rule: #dcd7cb;
            --header: rgba(245, 243, 238, 0.9);
            --surface: #efece5;
            --accent: #2447c4;
            --accent-warm: #b4541a;
            --shadow: rgba(27, 26, 23, 0.06);
            --serif: "Newsreader", "Noto Serif CJK SC", "Songti SC", SimSun, serif;
            --sans: "Inter", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
            --code: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
          }

          html[data-theme="dark"] {
            color-scheme: dark;
            --page: #131312;
            --raised: #191918;
            --text: #ecebe5;
            --soft: #b4b1a7;
            --muted: #7f7c73;
            --rule: #2b2a27;
            --header: rgba(19, 19, 18, 0.9);
            --surface: #1f1e1c;
            --accent: #86a6ff;
            --accent-warm: #f0a066;
            --shadow: rgba(0, 0, 0, 0.24);
          }

          *, *::before, *::after { box-sizing: border-box; }

          html {
            min-width: 18rem;
            overflow-x: hidden;
            background: var(--page);
            font-family: var(--sans);
            font-size: 120%;
            line-height: 1.7;
            scrollbar-color: rgba(100, 100, 100, 0.45) transparent;
            scrollbar-width: thin;
          }

          body {
            min-height: 100vh;
            margin: 0;
            color: var(--text);
            background: var(--page);
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }

          a { color: inherit; text-decoration: none; }
          button { font: inherit; }

          .skip-link {
            position: fixed;
            z-index: 20;
            top: 0.5rem;
            left: 0.5rem;
            padding: 0.45rem 0.7rem;
            color: var(--page);
            background: var(--text);
            transform: translateY(-150%);
          }

          .skip-link:focus { transform: translateY(0); }

          .site-header {
            position: sticky;
            z-index: 10;
            top: 0;
            border-top: 1px solid var(--rule);
            border-bottom: 1px solid var(--rule);
            background: var(--header);
            backdrop-filter: blur(14px);
          }

          .header-inner {
            width: min(calc(100% - 2rem), 1180px);
            min-height: 3rem;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }

          .brand {
            font-family: var(--serif);
            font-size: 1.2rem;
            font-weight: 600;
            letter-spacing: -0.02em;
          }

          .header-nav { display: flex; align-items: center; gap: 1rem; }
          .header-nav a { position: relative; color: var(--soft); font-size: 0.9rem; }
          .header-nav a:hover, .header-nav a:focus-visible { color: var(--text); }
          .header-nav a.is-active::after {
            position: absolute;
            right: 0;
            bottom: -0.56rem;
            left: 0;
            height: 1px;
            background: var(--text);
            content: "";
          }

          .theme-toggle {
            width: 1.8rem;
            height: 1.8rem;
            padding: 0;
            border: 0;
            color: var(--soft);
            background: transparent;
            cursor: pointer;
          }

          .theme-toggle:hover, .theme-toggle:focus-visible { color: var(--accent); outline: 0; }

          main {
            width: min(calc(100% - 2rem), 900px);
            min-height: 100vh;
            margin: 0 auto;
            padding: clamp(3.7rem, 9vw, 6.8rem) clamp(1rem, 3vw, 2.2rem) 4rem;
            border-inline: 1px solid var(--rule);
          }

          .eyebrow {
            margin: 0 0 0.65rem;
            color: var(--accent);
            font-family: var(--code);
            font-size: 0.62rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          h1, h2, .item-title {
            font-family: var(--serif);
          }

          h1 {
            max-width: 13ch;
            margin: 0;
            font-size: clamp(2.6rem, 7vw, 4.2rem);
            font-weight: 500;
            letter-spacing: -0.03em;
            line-height: 1.02;
          }

          .lead {
            max-width: 42rem;
            margin: 1.4rem 0 0;
            color: var(--muted);
            font-size: 0.98rem;
          }

          .subscribe {
            margin-top: 2.4rem;
            border: 1px solid var(--rule);
            background: var(--raised);
            border-radius: 2px;
          }

          .subscribe-row {
            min-width: 0;
            padding: 0.8rem 0.9rem;
            display: grid;
            grid-template-columns: auto minmax(0, 1fr) auto;
            align-items: center;
            gap: 0.8rem;
          }

          .subscribe-label {
            color: var(--muted);
            font-family: var(--code);
            font-size: 0.58rem;
            letter-spacing: 0.09em;
          }

          #feed-url {
            min-width: 0;
            overflow: hidden;
            color: var(--soft);
            font-family: var(--code);
            font-size: 0.7rem;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .copy-button {
            padding: 0.25rem 0.5rem;
            border: 1px solid var(--rule);
            color: var(--soft);
            background: var(--surface);
            font-family: var(--code);
            font-size: 0.62rem;
            cursor: pointer;
          }

          .copy-button:hover, .copy-button:focus-visible { color: var(--accent); border-color: var(--accent); outline: 0; }
          .copy-button[data-state="success"] { color: var(--accent); }

          .feed-heading {
            margin-top: clamp(3.5rem, 8vw, 6rem);
            padding-bottom: 0.7rem;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 1rem;
            border-bottom: 1px solid var(--rule);
          }

          .feed-heading h2 { margin: 0; font-size: 1.65rem; font-weight: 500; }
          .feed-count { color: var(--muted); font-family: var(--code); font-size: 0.62rem; }

          .feed-list { margin: 0; padding: 0; list-style: none; }

          .feed-item {
            padding: 1.8rem 0;
            display: grid;
            grid-template-columns: 2.5rem minmax(0, 1fr) auto;
            gap: 1rem;
            border-bottom: 1px solid var(--rule);
          }

          .serial {
            padding-top: 0.22rem;
            color: var(--accent);
            font-family: var(--code);
            font-size: 0.66rem;
          }

          .item-meta {
            margin-bottom: 0.28rem;
            color: var(--muted);
            font-family: var(--code);
            font-size: 0.62rem;
            letter-spacing: 0.035em;
          }

          .item-title { margin: 0; font-size: clamp(1.15rem, 3vw, 1.45rem); font-weight: 500; line-height: 1.3; }
          .item-title a:hover, .item-title a:focus-visible { color: var(--accent); outline: 0; }

          .item-summary {
            max-width: 44rem;
            margin: 0.62rem 0 0;
            color: var(--muted);
            font-size: 0.82rem;
            line-height: 1.65;
          }

          .categories { margin-top: 0.72rem; display: flex; flex-wrap: wrap; gap: 0.38rem; }
          .category {
            padding: 0.08rem 0.38rem;
            border: 1px solid var(--rule);
            color: var(--muted);
            font-family: var(--code);
            font-size: 0.55rem;
            line-height: 1.5;
          }

          .item-arrow { padding-top: 1.55rem; color: var(--accent); font-family: var(--code); font-size: 0.82rem; }

          .feed-note {
            margin-top: 2.5rem;
            padding-top: 1.1rem;
            color: var(--muted);
            border-top: 1px solid var(--rule);
            font-size: 0.72rem;
          }

          .feed-note a { color: var(--soft); border-bottom: 1px solid var(--rule); }
          .feed-note a:hover, .feed-note a:focus-visible { color: var(--accent); border-color: var(--accent); outline: 0; }

          @media (max-width: 640px) {
            html { font-size: 100%; }
            .header-inner { width: min(calc(100% - 1.2rem), 1180px); }
            .header-nav { gap: 0.72rem; }
            .header-nav .home-link { display: none; }
            main { width: min(calc(100% - 2rem), 900px); padding-top: 3.5rem; }
            .subscribe-row { grid-template-columns: 1fr auto; gap: 0.45rem 0.7rem; }
            .subscribe-label { grid-column: 1 / -1; }
            .feed-item { grid-template-columns: 1.8rem minmax(0, 1fr); gap: 0.65rem; padding: 1.5rem 0; }
            .item-arrow { display: none; }
            .item-summary { font-size: 0.86rem; }
          }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { scroll-behavior: auto !important; }
          }
        </style>
      </head>
      <body>
        <a class="skip-link" href="#feed-content">跳到订阅内容</a>
        <header class="site-header">
          <div class="header-inner">
            <a class="brand">
              <xsl:attribute name="href"><xsl:value-of select="$site-url" /></xsl:attribute>
              <xsl:value-of select="$feed-title" />
            </a>
            <nav class="header-nav" aria-label="订阅导航">
              <a class="home-link" href="/posts/">文章</a>
              <a href="/rss.xml">
                <xsl:if test="not($is-atom)"><xsl:attribute name="class">is-active</xsl:attribute></xsl:if>
                RSS
              </a>
              <a href="/atom.xml">
                <xsl:if test="$is-atom"><xsl:attribute name="class">is-active</xsl:attribute></xsl:if>
                Atom
              </a>
              <button id="theme-toggle" class="theme-toggle" type="button" aria-label="切换深浅色主题" title="切换深浅色主题">◐</button>
            </nav>
          </div>
        </header>

        <main id="feed-content">
          <section aria-labelledby="feed-title">
            <p class="eyebrow">
              SYNDICATION /
              <xsl:choose>
                <xsl:when test="$is-atom">ATOM</xsl:when>
                <xsl:otherwise>RSS</xsl:otherwise>
              </xsl:choose>
            </p>
            <h1 id="feed-title">订阅 <xsl:value-of select="$feed-title" /></h1>
            <p class="lead"><xsl:value-of select="$feed-description" /></p>

            <div class="subscribe" aria-label="订阅地址">
              <div class="subscribe-row">
                <span class="subscribe-label">FEED URL</span>
                <code id="feed-url"><xsl:value-of select="$feed-url" /></code>
                <button id="copy-feed" class="copy-button" type="button">复制</button>
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-heading">
            <div class="feed-heading">
              <h2 id="recent-heading">近期文章</h2>
              <span class="feed-count">
                <xsl:value-of select="count(/rss/channel/item | /atom:feed/atom:entry)" /> 篇 ·
                <xsl:choose>
                  <xsl:when test="$is-atom">ATOM 1.0</xsl:when>
                  <xsl:otherwise>RSS 2.0</xsl:otherwise>
                </xsl:choose>
              </span>
            </div>

            <ol class="feed-list">
              <xsl:for-each select="/rss/channel/item | /atom:feed/atom:entry">
                <li class="feed-item">
                  <span class="serial"><xsl:number value="position()" format="01" /></span>
                  <article>
                    <div class="item-meta">
                      <xsl:choose>
                        <xsl:when test="self::atom:entry"><xsl:value-of select="substring(atom:published, 1, 10)" /></xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="substring(pubDate, 13, 4)" />-<xsl:call-template name="month-number">
                            <xsl:with-param name="month" select="substring(pubDate, 9, 3)" />
                          </xsl:call-template>-<xsl:value-of select="substring(pubDate, 6, 2)" />
                        </xsl:otherwise>
                      </xsl:choose>
                    </div>
                    <h3 class="item-title">
                      <a>
                        <xsl:attribute name="href">
                          <xsl:choose>
                            <xsl:when test="self::atom:entry"><xsl:value-of select="atom:link[@rel='alternate'][1]/@href" /></xsl:when>
                            <xsl:otherwise><xsl:value-of select="link" /></xsl:otherwise>
                          </xsl:choose>
                        </xsl:attribute>
                        <xsl:value-of select="title | atom:title" />
                      </a>
                    </h3>
                    <p class="item-summary"><xsl:value-of select="description | atom:summary" /></p>
                    <xsl:if test="category or atom:category">
                      <div class="categories" aria-label="分类和标签">
                        <xsl:for-each select="category | atom:category">
                          <span class="category">
                            <xsl:choose>
                              <xsl:when test="self::atom:category"><xsl:value-of select="@label | @term" /></xsl:when>
                              <xsl:otherwise><xsl:value-of select="." /></xsl:otherwise>
                            </xsl:choose>
                          </span>
                        </xsl:for-each>
                      </div>
                    </xsl:if>
                  </article>
                  <span class="item-arrow" aria-hidden="true">↗</span>
                </li>
              </xsl:for-each>
            </ol>
          </section>

          <footer class="feed-note">
            这是面向阅读器的标准订阅源。复制上方地址添加到阅读器，或切换到
            <a href="/rss.xml">RSS</a> / <a href="/atom.xml">Atom</a> 格式。
            <a>
              <xsl:attribute name="href"><xsl:value-of select="$site-url" /></xsl:attribute>
              返回网站 ↗
            </a>
          </footer>
        </main>

        <script type="text/javascript"><![CDATA[
          (function () {
            var root = document.documentElement;
            var themeKey = 'zu1k-theme';
            var savedTheme = null;
            try { savedTheme = localStorage.getItem(themeKey); } catch (error) {}
            var theme = savedTheme === 'light' || savedTheme === 'dark'
              ? savedTheme
              : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            root.setAttribute('data-theme', theme);

            var themeButton = document.getElementById('theme-toggle');
            function updateThemeButton() {
              if (!themeButton) return;
              themeButton.textContent = root.getAttribute('data-theme') === 'dark' ? '☼' : '◐';
            }
            updateThemeButton();
            if (themeButton) {
              themeButton.addEventListener('click', function () {
                var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', nextTheme);
                try { localStorage.setItem(themeKey, nextTheme); } catch (error) {}
                updateThemeButton();
              });
            }

            var copyButton = document.getElementById('copy-feed');
            var feedUrl = document.getElementById('feed-url');
            if (copyButton && feedUrl) {
              copyButton.addEventListener('click', function () {
                var value = feedUrl.textContent || '';
                var copyPromise;
                if (navigator.clipboard && window.isSecureContext) {
                  copyPromise = navigator.clipboard.writeText(value);
                } else {
                  var input = document.createElement('textarea');
                  input.value = value;
                  input.style.position = 'fixed';
                  input.style.opacity = '0';
                  document.body.appendChild(input);
                  input.select();
                  var copied = document.execCommand('copy');
                  document.body.removeChild(input);
                  copyPromise = copied ? Promise.resolve() : Promise.reject();
                }
                copyPromise.then(function () {
                  copyButton.textContent = '已复制';
                  copyButton.setAttribute('data-state', 'success');
                  window.setTimeout(function () {
                    copyButton.textContent = '复制';
                    copyButton.removeAttribute('data-state');
                  }, 1600);
                }).catch(function () {
                  copyButton.textContent = '复制失败';
                  window.setTimeout(function () { copyButton.textContent = '复制'; }, 1600);
                });
              });
            }
          })();
        ]]></script>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="month-number">
    <xsl:param name="month" />
    <xsl:choose>
      <xsl:when test="$month = 'Jan'">01</xsl:when>
      <xsl:when test="$month = 'Feb'">02</xsl:when>
      <xsl:when test="$month = 'Mar'">03</xsl:when>
      <xsl:when test="$month = 'Apr'">04</xsl:when>
      <xsl:when test="$month = 'May'">05</xsl:when>
      <xsl:when test="$month = 'Jun'">06</xsl:when>
      <xsl:when test="$month = 'Jul'">07</xsl:when>
      <xsl:when test="$month = 'Aug'">08</xsl:when>
      <xsl:when test="$month = 'Sep'">09</xsl:when>
      <xsl:when test="$month = 'Oct'">10</xsl:when>
      <xsl:when test="$month = 'Nov'">11</xsl:when>
      <xsl:when test="$month = 'Dec'">12</xsl:when>
      <xsl:otherwise>00</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
