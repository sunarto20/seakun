const ipcRender = require("electron").ipcRenderer;

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
    ipcRender.send("start", fields);
  }
});

ipcRender.on("on start", (event, args) => {
  console.log(args);
});
