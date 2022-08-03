function expandContent(contentId) {
  fetch(`/content/${contentId}/children`)
    .then((response) => response.json())
    .then((response) => {
      const contentElement = document.getElementById(`content-${contentId}`);
      const expandButtonElement = contentElement.getElementsByTagName("button")[0];

      if (response.length !== 0) {
        const childList = document.createElement("ul");

        response.forEach((child) => {
          const childListItem = document.createElement("li");

          const childDiv = document.createElement("div");
          childDiv.id = `content-${child.id}`;
          childDiv.classList.add("content-card");

          const childCheckbox = document.createElement("input");
          childCheckbox.id = `checkbox-content-${child.id}`;
          childCheckbox.name = child.id;
          childCheckbox.type = "checkbox";

          const childLabel = document.createElement("label");
          childLabel.htmlFor = `checkbox-content-${child.id}`;
          childLabel.innerText = child.title;

          const childButton = document.createElement("button");
          childButton.type = "button";
          childButton.innerText = "Expand";
          childButton.onclick = () => {
            expandContent(child.id);
          }

          childDiv.appendChild(childCheckbox);
          childDiv.appendChild(childLabel);
          childDiv.appendChild(childButton);
          childListItem.appendChild(childDiv);
          childList.appendChild(childListItem);
        });

        contentElement.appendChild(childList);
      }

      contentElement.removeChild(expandButtonElement);
    }, (reason) => {
      const contentElement = document.getElementById(`content-${contentId}`);
      const errorParagraph = document.createElement("p");
      errorParagraph.innerText = JSON.stringify(reason);
      contentElement.appendChild(errorParagraph);
    });
}
