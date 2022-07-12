const products = await window.scanner.list()

const element = document.getElementById("products");

if(products.size > 0){
    for (let product of products){

        const btn = document.createElement("div");
        btn.setAttribute("class", "card");

        const link = btn.appendChild(document.createElement("a"))
        link.appendChild(document.createTextNode(product[1].host)); 
        link.setAttribute("href", "http://"+product[1].address);

        element.appendChild(btn);
    }
}else{
    const content = document.createElement("div");
    const text = content.appendChild(document.createTextNode("Aucun appareil n'a été détecté sur le réseau"))
    element.appendChild(text);
}
