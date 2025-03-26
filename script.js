const apiBaseUrl = "https://web-production-c4c73.up.railway.app";  // 替换为后端部署的URL
let orderList = [];

async function fetchMenu() {
    fetch("https://web-production-c4c73.up.railway.app/menu")
    .then(response => response.json())
    .then(data => {
        let menuContainer = document.getElementById("menu");
        menuContainer.innerHTML = ""; // 清空菜单
        data.forEach(item => {
            let menuItem = document.createElement("div");
            menuItem.className = "menu-item";
            menuItem.innerHTML = `
                <img src="https://web-production-c4c73.up.railway.app${item.image_url}" alt="${item.name}" class="menu-image">
                <p>${item.name}</p>
                <button onclick="addToCart('${item.id}', '${item.name}')">点菜</button>
            `;
            menuContainer.appendChild(menuItem);
        });
    })
    .catch(error => console.error("加载菜单出错：", error));

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

document.getElementById("addItemForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    let formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("image", document.getElementById("image").files[0]);

    fetch("https://web-production-c4c73.up.railway.app/add_item", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload(); // 刷新页面
    })
    .catch(error => console.error("上传菜品失败：", error));
});

fetchMenu();
