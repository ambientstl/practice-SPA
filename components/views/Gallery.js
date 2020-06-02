export default st => `<section id="gallery">
${st.pictures
  .map(picture => `<img src="${picture.url}" alt="${picture.title}">`)
  .join("")}
</section>`;
// export default st => `
// <section id="gallery">
// ${st.dogPictures
//   .map(pic => `<img src="${pic.url}" alt="${pic.title}">`)
//   .join(" ")}
// </section>
// `;
