function showDetails(title, img) {

  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalImage").src = img;

  let info = "";
  let price = "";

  if(title.includes("BMW")){
    info = "BMW is known for luxury, performance and German engineering.";
    price = "₹85.00 Lakh";
  }

  else if(title.includes("MG")){
    info = "MG cars provide advanced technology and modern design.";
    price = "₹22.00 Lakh";
  }

  else if(title.includes("Jaguar")){
    info = "Jaguar offers premium luxury with powerful performance.";
    price = "₹1.10 Crore";
  }

  document.getElementById("modalInfo").innerText = info;
  document.getElementById("modalPrice").innerText = price;

  let modal = new bootstrap.Modal(document.getElementById("carModal"));
  modal.show();
}

function buyCar(){
  alert("Thank you for choosing Car World 🚗");
}