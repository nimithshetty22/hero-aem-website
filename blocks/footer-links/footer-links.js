const buttonClassRemover = (listOfPara) => {
  if (listOfPara) {
    listOfPara.forEach((fLink) => {
      fLink.classList.remove('button-container');

      const linkAnchor = fLink.querySelector('a');
      if (linkAnchor) linkAnchor.classList.remove('button');
    });
  }
};

export default async function decorate(block) {
  const footerLinks = block.querySelectorAll('.footer-links > div p');
  buttonClassRemover(footerLinks);
}
