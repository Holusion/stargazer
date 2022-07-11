const products = await window.scanner.list()

const element = document.getElementById("products");

for (let product of products) {

    const btn = document.createElement("div");
    btn.setAttribute("class", "card");

    const link = btn.appendChild(document.createElement("a"))
    link.appendChild(document.createTextNode(product[1].host)); 
    link.setAttribute("href", "http://"+product[1].address);

    element.appendChild(btn);
}
