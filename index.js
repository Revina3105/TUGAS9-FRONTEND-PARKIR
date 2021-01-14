let parkList = [];

let mobilPrice = 3000;
let mobilNextPrice = 1500;
let motorPrice = 2000;
let motorNextPrice = 1000;

/*
DOM Kotak abu
*/
let JK = document.querySelector("#jenisKendaraan");
let NP = document.querySelector("#nomorParkir");
let WM = document.querySelector("#waktuMasuk");
let WK = document.querySelector("#waktuKeluar");
let Trf = document.querySelector("#tarif");
/*
DOM Kotak abu
*/

function showDataParkir() {}

function getTicket(event) {
  event.preventDefault();

  let jk = document.querySelector("#jenisKendaraanInpt");
  let pn = document.querySelector("#platNumberM");
  let np = document.querySelector("#noParkir");
  parkList.push({
    id: np.value,
    platNumber: pn.value,
    jenisKendaraan: jk.value,
    waktuMasuk: new Date(),
    waktuKeluar: null,
    price: null,
    status: false,
  });
  JK.value = jk.value;
  NP.value = np.value;
  WM.value = new Date().toLocaleTimeString();
}

function getPrice(event) {
  event.preventDefault();
  let pn = document.querySelector("#platNumberK");
  const parkData = parkList.find((data) => (data.platNumber = pn.value));
  if (!parkData.status) {
    JK.value = parkData.jenisKendaraan;
    NP.value = parkData.id;
    WM.value = parkData.waktuMasuk.toLocaleTimeString();
    WK.value = new Date().toLocaleTimeString();
    const diff = Math.ceil((new Date() - parkData.waktuMasuk) / (1000 * 60));
    let price = parkData.jenisKendaraan === "Mobil" ? mobilPrice : motorPrice;
    price +=
      (diff - 1) * parkData.jenisKendaraan === "Mobil"
        ? mobilNextPrice
        : motorNextPrice;
    // dapatin tarif
    Trf.value = price;
    parkList.forEach((elem) => {
      if (elem.platNumber == pn.value) {
        elem.waktuKeluar = new Date();
        elem.status = true;
        elem.price = price;
      }
    });
  } else {
    alert("mobil sudah keluar");
  }
}

function generateCode() {
  const input = document.querySelector("#noParkir");
  const id = uuid.v4();
  input.value = id;
}

function generatePrice(parkingId, no) {
  let outIdx;
  // checking id from data
  const out = parkList.find((data, idx) => {
    outIdx = idx;
    return data.id == parkingId;
  });

  if (out) {
    // checking is id already used
    if (out.status) {
      alert("Kendaraan sudah keluar!!!");
      return;
    }

    // count diff time
    const dateNow = new Date();
    const diff = Math.ceil((dateNow - out.timeIn) / (1000 * 60));

    // set price
    let price = defaultData[out.type].first;
    if (diff > 1) {
      price += (diff - 1) * defaultData[out.type].next;
    }

    // update data
    parkList[outIdx] = {
      ...parkList[outIdx],
      status: true,
      timeOut: dateNow,
      price: price,
      plateNo: no,
    };
  } else {
    alert("Data tidak ditemukan!!!");
  }
}

function dataParkir() {
  renderParkingTable(parkList);
  document.querySelector(".parkingTicket").classList.toggle("hidden");
  document.querySelector(".parkingDataTable").classList.toggle("hidden");
}

document.querySelector("#mySearch").addEventListener("input", (event) => {
  let query = event.target.value;
  console.log(query);
  let data =
    query.length > 0
      ? parkList.filter(
          (datum) =>
            datum.platNumber.toUpperCase().includes(query.toUpperCase()) ||
            datum.jenisKendaraan.toUpperCase().includes(query.toUpperCase())
        )
      : parkList;
  renderParkingTable(data);
});

function renderParkingTable(data) {
  let markups = data
    .map(
      (datum, index) => `<tr>
              <th scope="col">${index}</th>
              <th scope="col">${datum.platNumber}</th>
              <th scope="col">${datum.jenisKendaraan}</th>
              <th scope="col" style="text-align: center">${
                datum.waktuMasuk
                  ? datum.waktuMasuk.toLocaleTimeString()
                  : "error"
              }</th>
              <th scope="col" style="text-align: center">${
                datum.waktuKeluar
                  ? datum.waktuKeluar.toLocaleTimeString()
                  : "belum keluar"
              }</th>
              <th scope="col">${datum.price || 0}</th>
              </tr>
  `
    )
    .join("");
  let tableBody = document.querySelector("tbody#parkingTable");
  tableBody.innerHTML = markups;
}
