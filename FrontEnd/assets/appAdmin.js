////// fonction qui verifie si sophie est loggé
function checkLogin() {
  if (localStorage.getItem("userId") && localStorage.getItem("token")) {
    return true; // Soso est connectée
  } else {
    return false; // Soso n'est pas connectée
  }
}
////// fonction qui cache les modales & liens de modification
if (checkLogin()) {
  // L'utilisateur est connecté
  document.getElementById("portfolio").style.display = "none";
  document.getElementById("portfolio_admin").style.display = "block";
  document.getElementById("introduction").style.display = "none";
  document.getElementById("introduction_admin").style.display = "flex";
  document.getElementById("head").style.display = "flex";
} else {
  // L'utilisateur n'est pas connecté
  document.getElementById("portfolio").style.display = "block";
  document.getElementById("portfolio_admin").style.display = "none";
  document.getElementById("head").style.display = "none";
}
////////////
//fonction qui deconnecte automatiquement quand je rafraichit la page
window.onbeforeunload = function () {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
};
////////////
let data;
// CREATION DES WORKS
// appel api Works
function fetchData() {
  fetch("http://localhost:5678/api/works")
    // methode then pour retourner la promesse de reponse
    .then(function (response) {
      //retourne la réponse au format JSON
      return response.json();
    })
    //methode then pour gerer les données sous forme json + fonction de rappel + arguments jsondata
    .then(function (jsonData) {
      data = jsonData;
      //crea d'une const pour aller chercher la classe gallery
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      const galleryAdmin = document.querySelector(".gallery_bis");
      galleryAdmin.innerHTML = "";
      //crea forEach pour parcourir tt les elements du tableau de données dans l'api, item = un objet du tableau
      data.forEach(function (item) {
        // crea des element html qui affichera ttes les data
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        // crea de l'element html + insertion du titre avec innertext
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = item.title;
        // définition de la source de l'image et du titre
        img.src = item.imageUrl;
        img.alt = item.title;
        // ajout des element img, title de l'image et figure, qui deviennent donc des element shtml a par entiere
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
        // ajout de cloneNode (merci stackOver) pour cloner les elements figue a gallery Admin
        galleryAdmin.appendChild(figure.cloneNode(true));
      });
    });
}
///// appel fonction
fetchData();
//Appel api categories
//CREATION DES FILTRES/CATEGORIES
fetch("http://localhost:5678/api/categories").then(function (response) {
  return response.json();
});
// création des constantes pour tout les boutons
const btnAll = document.querySelector(".btn-all");
const btnObjects = document.querySelector(".btn-objects");
const btnFlat = document.querySelector(".btn-flat");
const btnHr = document.querySelector(".btn-hr");
// utilisation d'un objet pour faire correspondre les categories et les identifiants de l'api
const categoryMapping = {
  Objets: 1,
  Appartements: 2,
  "Hotels & restaurants": 3,
};
// creation de la const qui fera le filtrage
const filterByCategory = function (categoryId) {
  const gallery = document.querySelector(".gallery");
  // on vide le contenu de la gallery pour qu'a chaque appel la gallery se remplissent qu'avec les elements du filtre
  gallery.innerHTML = "";
  // nouvel emploi de la fonction foreach pour reparcourir les element du tableau api
  data.forEach(function (item) {
    /*cette ligne indique que si mon item correspond a la caté ça m'affiche le id correspondant 
en revanche si l'id est = 0 alors tu m'affiches tout*/
    if (item.categoryId === categoryId || categoryId === 0) {
      // nouvelle creation de chaque element comme précédemment
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      figcaption.innerHTML = item.title;
      img.src = item.imageUrl;
      img.alt = item.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  });
};
// et enfin addeventlistener + utilisation des constantes
btnAll.addEventListener("click", function () {
  filterByCategory(0);
});

btnObjects.addEventListener("click", function () {
  filterByCategory(categoryMapping["Objets"]);
});

btnFlat.addEventListener("click", function () {
  filterByCategory(categoryMapping["Appartements"]);
});

btnHr.addEventListener("click", function () {
  filterByCategory(categoryMapping["Hotels & restaurants"]);
});

////////////////// 1ere modale ////////////////////////
///fonction pour supprimé une photo
// récup les éléments HTML
const modalTrigger = document.getElementById("modal-trigger");
const modalContainer = document.getElementById("modal-container");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const imageContainer = document.getElementById("image-container");

// fonction qui ouvre la modale et affiche les images
function openModal() {
  // passe en revue les données de l'API et créer une balise img pour chaque image
  data.forEach(function (item) {
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.title;
    imageContainer.appendChild(image);
    const deleteIcon = document.createElement("i"); // Création de l'icône de suppression
    deleteIcon.classList.add("fa-solid", "fa-trash-can"); // Ajout des classes CSS pour l'icôn
    imageContainer.appendChild(deleteIcon); // Ajout de l'icône de suppression à la figure
    // ajouter l'event listener pour chaque icône de suppression
    deleteIcon.addEventListener("click", function () {
      console.log(
        "Vous avez cliqué sur le bouton de suppression pour l'image " +
          item.title
      );
      ///// ajout de la fonction qui va supprimer les photos
      deleteProject(item.id);
    });
  });
  // afficher la modale
  modalContainer.style.display = "block";
}

// Fonction qui ferme la modale et vide l'image-container + ajout de ADM pour fermer les deux modales en même temps
function closeModal() {
  imageContainer.innerHTML = "";
  modalContainer.style.display = "none";
  addModalContainer.style.display = "none";
}
// ouvre la modale au clic sur le bouton "Modifier"
modalTrigger.addEventListener("click", function () {
  openModal();
});
// ferme la modale au clic sur la croix
modalClose.addEventListener("click", function () {
  closeModal();
});
// Événement au clic en dehors de la modale + l'ajout de || event.target == addModalContainer pour fermer les deux modales en meme temps
window.addEventListener("click", function (event) {
  if (event.target == modalContainer || event.target == addModalContainer) {
    closeModal();
  }
});
/// bouton pour afficher la deuxieme modale
const addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", function () {
  console.log("Le bouton 'Ajouter une photo' a été cliqué !");
  openAddModal();
});

//////
///2eme modale
///Recup les elements html de la deuxieme modale
const addModalContainer = document.getElementById("add-modal-container");
const addModalBack = document.getElementById("add-modal-back");
const addModalClose = document.getElementById("add-modal-close");
/// annule l'affichage de la 2eme modale
addModalContainer.style.display = "none";
/// fonction pour ouvrir la 2eme modale
function openAddModal() {
  addModalContainer.style.display = "block";
}
/////////////// ferme la 2eme modale au clic sur le retour en arrière
function closeAddModal() {
  addModalContainer.style.display = "none";
}
/// retour en arrière
addModalBack.addEventListener("click", function () {
  closeAddModal();
});
/// ferme la 2eme modale au clique sur la croix
addModalClose.addEventListener("click", function () {
  closeModal();
});
//// element html de la partie image du formulaire de la 2eme modale
const fileInput = document.getElementById("file-input");
const addPhotoButton = document.querySelector("label[for='file-input']");
const previewImg = document.getElementById("preview");

addPhotoButton.addEventListener("click", function (event) {
  event.preventDefault(); /// ça s'ouvrait deux fois
  fileInput.click();
});
///////////////////// ajout avec Luc, preview de l'image qu'on va ajouter
fileInput.addEventListener("change", function () {
  const [file] = fileInput.files;
  if (file) {
    previewImg.style.display = "block";
    previewImg.src = URL.createObjectURL(file);
  }
});
///////////// const qui stock le token et gei pour le bouton submit

const addModalSubmitButton = document.getElementById("add-modal-submit-button");
/////// event click sur le submit btn
addModalSubmitButton.addEventListener("click", function () {
  const formData = {
    title: document.getElementById("add-modal-title-input").value,
    fileInput: document.getElementById("file-input").files[0],
    categoryId: document.getElementById("add-modal-category-input").value,
  };
  //// ajout de la fonction qui ajoute les projets
  addProject(formData, localStorage.getItem("token"));
});
//// fonction qui ajoute les photos
function addProject(formData, token) {
  const form = new FormData();
  form.append("title", formData.title);
  form.append("image", formData.fileInput);
  form.append("category", formData.categoryId);

  ////réponse si le formulaire est mal rempli
  if (!formData.title || !formData.fileInput || !formData.categoryId) {
    alert("Veuillez remplir tous les champs !");
    return; // Sort de la fonction si un champ est vide
  }

  fetch("http://localhost:5678/api/works", {
    headers: {
      authorization: "Bearer " + token,
      accept: "application/json",
      contentType: "multipart/form-data",
    },
    method: "POST",
    body: form,
  })
    .then((response) => {
      if (response.status === 201) {
        // Le formulaire a été soumis avec succès
        alert("Le formulaire a été soumis avec succès !");
        closeModal();
        fetchData();
        return response.json();
      } else {
        // Il y a eu une erreur lors de la soumission du formulaire
        alert("Il y a eu une erreur lors de la soumission du formulaire.");
      }
    })
    .then((json) => {
      console.log(JSON.stringify(json));
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
}

//////// fonction qui supp les photos
function deleteProject(projectId) {
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, /// demander a luc pour la dif de syntaxe
    },
  })
    .then((response) => {
      if (response.status === 204) {
        // Le projet a été supprimé avec succès
        alert("Le projet a été supprimé avec succès !");
        closeModal();
        fetchData();
      } else {
        // Il y a eu une erreur lors de la suppression du projet
        alert("Il y a eu une erreur lors de la suppression du projet.");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
}
