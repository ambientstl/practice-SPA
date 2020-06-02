export default links => `<nav>
<i class="fas fa-bars"></i>
<ul class="hidden--mobile nav-links">
  ${links
    .map(link => `<li><a href="/${link}" data-navigo>${link}</a></li>`)
    .join("")}
</ul>
</nav>`;
