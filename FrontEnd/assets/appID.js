// appel de la fonction submitform (html)
function submitForm() {
  // Récupération des email et password .value tres important
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // fetch api
  fetch("http://localhost:5678/api/users/login", {
    // comme sur le tuto, envoi au format json
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // transforme les id en string au format json
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    // fonction reponse + message d'erreur .ok pour true or false
    .then(function (response) {
      if (!response.ok) {
        // Affichage d'un message d'erreur
        alert("user not found");
        // ne retourne rien, sert juste a sortir de la fonction
        return;
      }
      // Récupération la réponse
      return response.json();
    })
    //fonction qui affichera la page si id et mdp sont correct
    .then(function (data) {
      // Vérification de la réussite de la connexion
      if (data.userId && data.token) {
        // Stockage des id et token
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);

        // Redirection vers la page principale
        window.location.href = "IndexSophie.html";
      } else {
        //message d'erreur
        alert(data.message);
      }
    });
}
