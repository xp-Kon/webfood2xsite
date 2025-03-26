const apiBaseUrl = "https://your-railway-app.up.railway.app";  // 替换为后端部署的URL
let orderList = [];

async function fetchMenu() {
    const res = await fetch(`${apiBaseUrl}/menu`);
    const menu = await res.json();
    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "";
    menu.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        div.innerHTML = `
            <img src="${apiBaseUrl}${item.image_url}" alt="${item.name}" />
            <p>${item.name}</p>
            <button onclick="addToCart('${item.name}')">点菜</button>
        `;
        menuDiv.appendChild(div);
    });
}

function addToCart(itemName) {
    orderList.push(itemName);
    updateOrderList();
}

function updateOrderList() {
    const orderListElem = document.getElementById("order-list");
    orderListElem.innerHTML = "";
    orderList.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        orderListElem.appendChild(li);
    });
}

document.getElementById("checkout-btn").addEventListener("click", async () => {
    const email = prompt("请输入您的邮箱地址:");
    const res = await fetch(`${apiBaseUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, order_items: orderList })
    });
    const result = await res.json();
    alert(result.message);
});

document.getElementById("add-item-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const res = await fetch(`${apiBaseUrl}/add_item`, {
        method: "POST",
        body: formData
    });
    if (res.ok) {
        alert("菜品添加成功！");
        form.reset();
        fetchMenu();
    } else {
        alert("添加菜品失败！");
    }
});

fetchMenu();
