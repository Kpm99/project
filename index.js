import { animals, dogs, fish } from "./data.mjs";

class Table {
  constructor(id, data, sortingParams, containerId, sortingDropdownId = null, nameStyles = {}, imageStyles = {}) {
    this.id = id; 
    this.data = [...data]; 
    this.originalData = [...data]; 
    this.sortingParams = sortingParams; 
    this.containerId = containerId; 
    this.sortingDropdownId = sortingDropdownId; 
    this.nameStyles = nameStyles; 
    this.imageStyles = imageStyles; 
    this.editIndex = null; 

    this.ensureContainerExists();
    this.renderTable(this.data); 
    this.createAddButton(); 
  }

  ensureContainerExists() {
    let mainContainer = document.getElementById("container");
    if (!mainContainer) {
      mainContainer = document.createElement("div");
      mainContainer.id = "container";
      document.body.appendChild(mainContainer);
    }

    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = this.containerId;
      container.style.margin = "20px 0";
      mainContainer.appendChild(container);
    }
  }

  renderTable(data) {
    const container = document.getElementById(this.containerId);

    const existingTable = container.querySelector(`#${this.id}`);
    if (existingTable) {
      container.removeChild(existingTable);
    }

    const table = document.createElement("table");
    table.id = this.id;
    table.style.margin = "auto";
    table.style.borderCollapse = "collapse";
    table.style.width = "80%";

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.style.border = "1px solid black";
      row.style.padding = "10px";

      Object.keys(item).forEach((key) => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        if (key === "image" && item[key]) {
        
          const img = document.createElement("img");
          img.src = item[key];
          img.style.width = this.imageStyles.width || "100px"; 
          img.style.height = this.imageStyles.height || "auto"; 
          img.style.border = this.imageStyles.border || "1px solid #ccc"; 
          td.appendChild(img);
        } else if (key === "name") {
        
          td.textContent = item[key];
          Object.keys(this.nameStyles).forEach((styleKey) => {
            td.style[styleKey] = this.nameStyles[styleKey];
          });
        } else {
          td.textContent = item[key];
        }

        tr.textContent = key + ":";
        tr.style.padding = "20px";
        tr.style.textAlign = "left";
        tr.appendChild(td);
        row.appendChild(tr);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.style.marginTop = "10px";
      editButton.style.padding = "5px 10px";
      editButton.style.cursor = "pointer";
      editButton.style.marginRight = "10px";
      editButton.addEventListener("click", () => {
        this.editRow(index); 
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.marginTop = "10px";
      deleteButton.style.padding = "5px 10px";
      deleteButton.style.cursor = "pointer";
      deleteButton.addEventListener("click", () => {
        this.deleteRow(index);
      });

      row.appendChild(editButton);
      row.appendChild(deleteButton);
      table.appendChild(row);
    });

    container.appendChild(table);
  }

  deleteRow(index) {
    this.data.splice(index, 1); 
    this.renderTable(this.data); 
  }

  editRow(index) {
    this.editIndex = index; 
    const itemToEdit = this.data[index]; 

    this.toggleForm(itemToEdit);
  }

  toggleForm(itemToEdit = null) {
    const container = document.getElementById(this.containerId);
    let formContainer = document.getElementById("formContainer");

    if (formContainer) {
      formContainer.remove(); 
    }

    formContainer = document.createElement("div");
    formContainer.id = "formContainer";
    formContainer.style.position = "fixed";
    formContainer.style.top = "50%";
    formContainer.style.left = "50%";
    formContainer.style.transform = "translate(-50%, -50%)";
    formContainer.style.padding = "20px";
    formContainer.style.border = "1px solid #ccc";
    formContainer.style.backgroundColor = "#f9f9f9";
    formContainer.style.zIndex = "1000"; 

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "16px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      formContainer.remove();
    });

    formContainer.appendChild(closeButton);

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";

    const speciesInput = document.createElement("input");
    speciesInput.placeholder = "Species";
    speciesInput.value = itemToEdit ? itemToEdit.species : "";
    speciesInput.required = true;

    const nameInput = document.createElement("input");
    nameInput.placeholder = "Name";
    nameInput.value = itemToEdit ? itemToEdit.name : "";
    nameInput.required = true;

    const locationInput = document.createElement("input");
    locationInput.placeholder = "Location";
    locationInput.value = itemToEdit ? itemToEdit.location : "";
    locationInput.required = true;

    const sizeInput = document.createElement("input");
    sizeInput.placeholder = "Size";
    sizeInput.value = itemToEdit ? itemToEdit.size : "";
    sizeInput.required = true;

    const imageInput = document.createElement("input");
    imageInput.placeholder = "Image URL";
    imageInput.value = itemToEdit ? itemToEdit.image : "";
    imageInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.type = "submit";
    submitButton.style.marginTop = "10px";

    form.appendChild(speciesInput)
    form.appendChild(nameInput);
    form.appendChild(locationInput);
    form.appendChild(sizeInput);
    form.appendChild(imageInput);
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    container.appendChild(formContainer);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const newItem = {
        species:speciesInput.value,
        name: nameInput.value,
        location: locationInput.value,
        size: parseInt(sizeInput.value),
        image: imageInput.value, 
      };

      if (this.editIndex !== null) {
       
        this.data[this.editIndex] = newItem;
      } else {
        
        this.data.push(newItem);
      }

     
      this.renderTable(this.data);

      formContainer.remove();
      this.editIndex = null; 
    });
  }

  createAddButton() {
    const container = document.getElementById(this.containerId);
    const addButton = document.createElement("button");
    addButton.textContent = "Add New Item";
    addButton.style.padding = "10px 20px";
    addButton.style.fontSize = "16px";
    addButton.style.cursor = "pointer";
    addButton.style.margin = "20px auto";
    addButton.style.display = "block";

    addButton.addEventListener("click", () => {
      this.editIndex = null; 
      this.toggleForm(); 
    });

    container.appendChild(addButton);
  }

  addSortingFeature(containerId) {
    this.ensureContainerExists();
    const container = document.getElementById(containerId);

    if (container.querySelector(`#${this.sortingDropdownId}`)) {
      return;
    }

    const sortContainer = document.createElement("div");
    sortContainer.className = "sorting-container";
    sortContainer.style.textAlign = "center";
    sortContainer.style.marginBottom = "20px";

    const sortingDropdown = document.createElement("select");
    sortingDropdown.id = this.sortingDropdownId;

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Sort by...";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    sortingDropdown.appendChild(defaultOption);

    this.sortingParams.forEach((param) => {
      const option = document.createElement("option");
      option.value = param;
      option.textContent = `Sort by ${param}`;
      sortingDropdown.appendChild(option);
    });

    sortingDropdown.addEventListener("change", (event) => {
      const selectedParam = event.target.value;
      this.sortData(selectedParam);
    });

    sortContainer.appendChild(sortingDropdown);
    container.insertBefore(sortContainer, container.firstChild);
  }

  sortData(param) {
    this.data.sort((a, b) => {
      if (a[param] > b[param]) return 1;
      if (a[param] < b[param]) return -1;
      return 0;
    });
    this.renderTable(this.data);
  }
}
const nameStyles = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "blue",
  fontStyle: "italic",
};

const nameStyles1 = {
  fontWeight: "bold",
  fontSize: "18px",
};

const imageStyles = {
  width: "120px",
  height: "auto",
  border: "2px solid black",
};

const tableInstance = new Table("animalTable", animals, ["species", "name", "location", "size"], "animalContainer", "animalSort", {},
  imageStyles);
tableInstance.addSortingFeature("animalContainer");


const dogTable = new Table(
  "dogTable",
  dogs,
  ["name", "location"],
  "dogContainer",
  "dogSortDropdown", nameStyles1, imageStyles
);
dogTable.addSortingFeature("dogContainer");




const fishTable = new Table(
  "fishTable",
  fish,
  ["size"],
  "fishContainer",
  "fishSortDropdown", nameStyles, imageStyles
);
fishTable.addSortingFeature("fishContainer");