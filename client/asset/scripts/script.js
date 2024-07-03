var InitialCount = -1;

const deleteProducts = async () => {
  const url = "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product";

  let res = await axios.get(url);
  const products = res.data;

  for (let product of products) {
    await axios.delete(
      `https://swiftpayindia-b4f8cce016d8.herokuapp.com/product/${product.id}`
    );
  }
  location.reload();
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

const loadProducts = async () => {
  const url = "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product";

  let res = await axios.get(url);
  const products = res.data;
  var len = products.length;

  if (len > InitialCount + 1) {
    $("#1").css("display", "none");
    $("#home").css("display", "grid");
    $("#2").css("display", "grid");
    var payable = 0;
    console.log(products);
    for (let product of products) {
      payable = payable + parseFloat(product.payable);
    }

    var product = products.pop();
    const x = `
        <section>
                <div class="card card-long animated fadeInUp once">
                    <img src="asset/img/${product.id}.png" class="album">
                    <div class="span1">Product Name</div>
                    <div class="card__product">
                        <span>${product.name}</span>
                    </div>
                    <div class="span2">${
                      product.unit === "U" ? "Per Unit" : "Per kg"
                    }</div>
                    <div class="card__price">
                        <span>${product.price} </span>
                    </div>
                    <div class="span3">Units</div>
                    <div class="card__unit">
                        <span>${product.taken} ${product.unit}</span>
                    </div>

                    <div class="span4">Payable</div>
                    <div class="card__amount">
                        <span>${product.payable}</span>
                    </div>
                </div>
            </section>
        <section>
        `;

    document.getElementById("home").innerHTML =
      document.getElementById("home").innerHTML + x;
    document.getElementById("2").innerHTML = "CHECKOUT ₹" + payable;
    InitialCount += 1;
  }
};

const checkout = async () => {
  document.getElementById("2").innerHTML =
    "<span class='loader-16' style='margin-left: 44%;'></span>";
  var payable = 0;
  const url = "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product";

  let res = await axios.get(url);
  const products = res.data;

  for (let product of products) {
    payable = payable + parseFloat(product.payable);
  }

  const payeeVPA = "ethenbiju@oksbi";
  const payeeName = "Ethen Biju";
  const currency = "INR";
  const googlePayURL = `upi://pay?pa=${payeeVPA}&pn=${payeeName}&am=${payable}&cu=${currency}`;
  const qrCodeAPI = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    googlePayURL
  )}`;

  await fetch(qrCodeAPI)
    .then(function (data) {
      return data.blob();
    })
    .then(function (img) {
      var image = URL.createObjectURL(img);
      $("#home").css("display", "none");
      $("#final").css("display", "none");
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      $("#image").attr("src", image);
      $("#qr").css("display", "grid");
    });

  setTimeout(function () {
    $("#qr").css("display", "none");
    $("#success").css("display", "grid");
  }, 10000);

  deleteProducts();
};

document.addEventListener("DOMContentLoaded", loadProducts);
