const fields = {
  email: null,
  password: null,
};

const button = document.getElementById("submit");

button.addEventListener("click", function () {
  fields.email = document.getElementById("email").value;
  fields.password = document.getElementById("password").value;

  if (fields.email === "" || fields.password === "") {
    alert("email and password cannot be blank");
  } else {
    alert("ok");
  }
});
