// Phần thanh tìm kiếm
var searchbox = document.getElementById("search");
var searchInput = searchbox.getElementsByTagName("input")[0];
var tagis = document.getElementsByTagName("i");
var searchButton = tagis[0];
var cart = tagis[1];

searchInput.oninput = function (event) {
  searchButton.onclick = function () {
    sendSearch(event.target.value);
  };
  searchInput.onkeyup = function (e) {
    // console.log(e.key == "Enter");
    if (e.key == "Enter") sendSearch(event.target.value);
    // if (e.which == 13) {
    //   sendSearch(event.target.value);
    // }
  };
};

var sendSearch = function (data) {
  // Cắt bỏ dấu cách bằng trim(), vô nghĩa khi gửi dấu cách đi
  if (data.trim().length > 0) {
    //Mô phỏng 1 cái form
    var form = document.createElement("form");
    form.action = "timkiem.html";
    form.method = "get";
    form.appendChild(searchInput);
    searchInput.name = "searchInformation";
    document.body.appendChild(form);
    form.submit();

    console.log("Gửi dữ liệu đi");
  } else console.log("Không gửi dữ liệu");
};

//Mở trang Đơn hàng khi click giỏ hàng
//Dùng lại biến cart ở phần search
cart.onclick = function () {
  //   window.open("donhang.html", "_self");
  window.location.href = "donhang.html";
};

var itemList = {
  sp001: {
    name: "Sữa Chua Vị Kiwi",
    price: 21000,
    photo: "./images/sanpham/kiwi.jpg",
  },
  sp002: {
    name: "Sữa Chua Vị Xoài",
    price: 22000,
    photo: "./images/sanpham/mango.jpg",
  },
  sp003: {
    name: "Sữa Chua Vị Dưa Lưới",
    price: 23000,
    photo: "./images/sanpham/cantaloupe.jpg",
  },
  sp004: {
    name: "Sữa Chua Vị Mâm Xôi",
    price: 24000,
    photo: "./images/sanpham/strawberry.jpg",
  },
  sp005: {
    name: "Sữa Chua Vị Dâu Tây",
    price: 25000,
    photo: "./images/sanpham/blueberry.jpg",
  },
  sp006: {
    name: "Sữa Chua Vị Việt Quốc",
    price: 26000,
    photo: "./images/sanpham/blueberry.jpg",
  },
  sp007: {
    name: "Sữa Chua Vị Bưởi",
    price: 27000,
    photo: "./images/sanpham/grapes.jpg",
  },
  sp008: {
    name: "Sữa Chua Vị Táo Xanh",
    price: 28000,
    photo: "./images/sanpham/green-apple.jpg",
  },
  sp009: {
    name: "Sữa Chua Vị Dứa",
    price: 29000,
    photo: "./images/sanpham/pineapple.jpg",
  },
};

//Chuyển object về mảng object cho mình dễ xài
var hoadon = [];
var i = 0;
for (var item in itemList) {
  hoadon[i] = {
    code: item,
    name: itemList[item].name,
    price: itemList[item].price,
    //Lấy số lượng từ localStorage
    count: parseInt(localStorage.getItem(item)),
    photo: itemList[item].photo,
    total: 0,
  };
  i++;
}

//Tính tiền mỗi sản phẩm
hoadon.forEach(function (sp) {
  if (sp.count >= 0 && sp.price >= 0) {
    sp.total = sp.count * sp.price;
  }
});

//Tính tổng tiền trước thuế
var totalPreTax = 0;
hoadon.forEach(function (sp) {
  totalPreTax += sp.total;
});

//Hàm tính chiết khấu
var getDiscountrate = function () {
  var day = new Date();

  var weekday = day.getDay();
  var totalMins = day.getHours() * 60 + day.getMinutes();
  if (
    weekday >= 1 &&
    weekday <= 3 &&
    ((totalMins >= 420 && totalMins <= 660) ||
      (totalMins >= 780 && totalMins <= 1020))
  )
    return 0.1;
  else return 0;
};

//Tính tiền chiết khấu
var discount = totalPreTax * getDiscountrate();

//Tính tiền thuế
var tax = 0.1 * (totalPreTax - discount);

//Tổng tiền cuối cùng
var finalTotal = totalPreTax - discount + tax;

//Hiển thị giỏi hàng, Xóa sản phẩm ra khỏi giỏ hàng
var showCart = function () {
  var bodyTable = document.getElementById("bodyTable");
  hoadon.forEach(function (sp) {
    if (sp.count > 0) {
      //Tạo từng hàng
      var tr = document.createElement("tr");
      tr.id = sp.code;

      //Tạo 6 ô trong mỗi hàng
      var td_photo = document.createElement("td");
      td_photo.innerHTML = `<img src=" ${sp.photo} " alt="" width="100px">`;
      tr.appendChild(td_photo);

      var td_name = document.createElement("td");
      td_name.innerHTML = `<span>${sp.name}</span>`;
      tr.appendChild(td_name);

      var td_count = document.createElement("td");
      td_count.innerHTML = `<span>${sp.count} lốc</span>`;
      tr.appendChild(td_count);

      var td_price = document.createElement("td");
      td_price.innerHTML = `<span>${sp.price} VNĐ</span>`;
      tr.appendChild(td_price);

      var td_total = document.createElement("td");
      td_total.innerHTML = `<span>${sp.total} VNĐ</span>`;
      tr.appendChild(td_total);

      var td_delete = document.createElement("td");
      td_delete.innerHTML = `<i id="${sp.code}" class="delete_product fa-solid fa-trash"></i>`;
      tr.appendChild(td_delete);

      //Xóa sản phẩm ra khỏi giỏ hàng
      // td_delete.onclick = function removeCart() {
      //   localStorage.removeItem(sp.code);
      //   location.reload("donhang.html");
      // };

      //Đưa từng hàng vào body của table
      bodyTable.appendChild(tr);
    }
  });

  //Hàm xóa sản phẩm ra khỏi giỏ hàng
  var delete_buttons = bodyTable.querySelectorAll(".delete_product");
  // console.log(delete_buttons);
  delete_buttons.forEach(function (delete_button) {
    delete_button.onclick = function removeCart() {
      localStorage.removeItem(delete_button.id);
      location.reload("donhang.html");
    };
  });

  //Hiển thị tính tiền ở thẻ tfoot
  var tdA = document.getElementById("tdA");
  tdA.innerText = `Thành tiền (A) = ${totalPreTax} VNĐ`;
  var tdB = document.getElementById("tdB");
  tdB.innerText = `Chiết Khấu (B) = 0.1xA = ${discount} VNĐ`;
  var tdC = document.getElementById("tdC");
  tdC.innerText = `Thuế (C) = 10% x (A-B) = ${tax} VNĐ`;
  var tdD = document.getElementById("tdD");

  //Có dùng span nên dùng innerHTML thay vì innerText
  tdD.innerHTML = `Tổng cộng (D) = A-B+C = <span>${finalTotal} VNĐ</span>`;
};

// Để ở đây không hợp lý, do chỉ cần trang Donhang tải lại là đủ rồi
// document.addEventListener("DOMContentLoaded", function () {
//   showCart();
// });
