
const API_URL = '/api/products';
window.addEventListener('load', init);

function init() {

	fetch(API_URL, {
		method: "GET"

	})
		.then(statusCheck)
		.then(resp => resp.json())
		.then(showProducts)
		.catch(console.log);

	fetch('/api/suppliers', {
		method: "GET"

	})
		.then(statusCheck)
		.then(resp => resp.json())
		.then(getSuppInfo)
		.catch(console.log);

	fetch('/api/categories', {
		method: "GET"

	})
		.then(statusCheck)
		.then(resp => resp.json())
		.then(getCateInfo)
		.catch(console.log);

}

//submenu show/ hide funtion.
document.addEventListener("click", function (e) {
    let clickedEl = e.target;
    if (clickedEl.classList.contains("showHideSubMenu")) {
      let subMenu = clickedEl.closest("li").querySelector(".subMenus");
      let mainMenuIcon = clickedEl
        .closest("li")
        .querySelector(".mainMenuIconArow");
  
      //close open submenus
      let subMenus = document.querySelectorAll(".subMenus");
      subMenus.forEach((sub) => {
        if (subMenu !== sub) {
          sub.style.display = "none";
        }
      });
      //check if there is submenu
      showHideSubMenu(subMenu, mainMenuIcon);
    }
  });
  
  function showHideSubMenu(subMenu, mainMenuIcon) {
    //console.log(subMenu.style.display);
    if (subMenu != null) {
      if (subMenu.style.display == "block") {
        //console.log(subMenu.style.display);
        subMenu.style.display = "none";
        mainMenuIcon.classList.remove("fa-angle-down");
        mainMenuIcon.classList.add("fa-angle-left");
      } else {
        subMenu.style.display = "block";
        mainMenuIcon.classList.remove("fa-angle-left");
        mainMenuIcon.classList.add("fa-angle-down");
      }
    }
  }
  

let addForm = document.querySelector("#add_new_item_form");
let editForm = document.querySelector("#edit_new_item_form");
addForm.style.display = "none";
editForm.style.display = "none";


// show products
let thisName = ""
let thisCategory = ""
let thisSupplier = ""
let thisBuyPrice = ""
let thisSellPrice = ""
let pID = 0
let pEleName = document.querySelectorAll("#name")
let pEleCategory = document.querySelectorAll("#category")
let pEleSupplier = document.querySelectorAll("#supplier")
let pEleBuyPrice = document.querySelectorAll("#buy_price")
let pEleSellPrice = document.querySelectorAll("#sell_price")

// information about products
let products = []
function showProducts(rows) {
	rows.forEach(r => {
		products.push(r)
	});
	const notAnyItem = document.querySelector(".alertNoItem")
	notAnyItem.classList.toggle("show", rows.length == 0)
	let board = document.getElementById("board")
	for (let i = 0; i < rows.length; i++) {
		let productID = rows[i]["productID"]
		let productName = rows[i]["productName"];
		let categoryName = rows[i]["categoryName"];
		let supplierName = rows[i]["supplierName"];
		let quantity = rows[i]["quantity"];
		let buyPrice = rows[i]["buyPrice"];
		let sellPrice = rows[i]["sellPrice"];
		board.innerHTML +=
			"  <div class=\"value_container\">\n" +
			"<div class=\"ID_value_attr value_attr\">" + productID + "</div>\n" +
			"<div class=\"name_value_attr value_attr\">" + productName + "</div>\n" +
			"<div class=\"category_value_attr value_attr\">" + categoryName + "</div>\n" +
			"<div class=\"supplier_value_attr value_attr\">" + supplierName + "</div>\n" +
			"<div class=\"quantity_value_attr value_attr\">" + quantity + "</div>\n" +
			"<div class=\"buy_price_value_attr value_attr\">" + buyPrice.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND</div>\n" +
			"<div class=\"sell_price_value_attr value_attr\">" + sellPrice.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND</div>\n" +
			"<div class=\"action_value_attr value_attr\">\n" +
			"<button id=\"edit_button\">Edit</button>\n" +
			"<button id=\"delete_button\">Delete</button>\n" +
			"</div>\n" +
			"</div>\n"
	}

	let nameValueAttr = document.querySelectorAll(".name_value_attr")
		nameValueAttr.forEach(e => {
	e.addEventListener("click", () =>{
		changeQuantity(e)
	})
});

	let editBtn = document.querySelectorAll("#edit_button")
	editBtn.forEach(e => {
		e.addEventListener("click", () => {
			editBtn.forEach(e => {
				e.disabled = true
			})
			let deleteBtn = document.querySelectorAll("#delete_button")
			deleteBtn.forEach(e => {
				e.disabled = true
			})
			let addBtn = document.querySelector(".add_new_item");
			addBtn.disabled = true
			let a = e.parentElement.parentElement
			let pOptCategory = document.querySelector("#optCate")
			let pOptSupplier = document.querySelector("#optSupp")
			let eleID = a.children[0]
			pID = eleID.innerHTML
			products.forEach(p => {
				if (p["productID"] == pID) {
					pEleName[1].placeholder = p["productName"]
					thisName = p["productName"]
					pOptCategory.innerText = p["categoryName"]
					thisCategory = p["categoryName"]
					pOptSupplier.innerText = p["supplierName"]
					thisSupplier = p["supplierName"]
					pEleBuyPrice[1].placeholder = p["buyPrice"]
					thisBuyPrice = p["buyPrice"]
					pEleSellPrice[1].placeholder = p["sellPrice"]
					thisSellPrice = p["sellPrice"]
				}
			});
			if (editForm.style.display == "none") {
				editForm.style.display = "block";
			}
		})
	});


	let editCancelButton = document.querySelectorAll("#cancel_edit_button")
	editCancelButton.forEach(e => {
		e.addEventListener("click", () => {
			editBtn.forEach(e => {
				e.disabled = false
			})
			let deleteBtn = document.querySelectorAll("#delete_button")
			deleteBtn.forEach(e => {
				e.disabled = false
			})
			let addBtn = document.querySelector(".add_new_item");
			addBtn.disabled = false
			pEleName[1].value = ""
			pEleCategory[1].value = ""
			pEleSupplier[1].value = ""
			pEleBuyPrice[1].value = ""
			pEleSellPrice[1].value = ""
			editForm.style.display = "none";
		})
	})

	// get deleteID
	let deleteBtn = document.querySelectorAll("#delete_button")

	deleteBtn.forEach(d => {
		d.addEventListener("click", () => {
			let b = d.parentElement.parentElement
			let eleID = b.children[0]
			let deleteID = eleID.innerHTML
			deleteProduct(deleteID)
		})

	})
	//search function

	let names = []
	let productName = document.querySelectorAll(".name_value_attr")
	productName.forEach(e => {
		names.push({ name: e.innerText, element: e.parentElement })
	})


	const searchInput = document.getElementById("search")
	searchInput.addEventListener("input", e => {
		const value = e.target.value
		const warning = document.querySelector(".Warning")
		names.forEach(n => {
			const isVisible = n.name.includes(value)
			n.element.classList.toggle("hide", !isVisible)
			warning.classList.toggle("show", document.querySelectorAll(".hide").length == document.querySelectorAll(".value_container").length)

		})
	})

}


// insert product function
let addBtn = document.querySelector(".add_new_item");
addBtn.addEventListener("click", () => {
	let editBtn = document.querySelectorAll("#edit_button")
	editBtn.forEach(e => {
		e.disabled = true
	})
	let deleteBtn = document.querySelectorAll("#delete_button")
	deleteBtn.forEach(e => {
		e.disabled = true
	})
	if (addForm.style.display == "none") {
		addForm.style.display = "block";
	}
});
let okAddBtn = document.querySelector("#ok_add_button")
okAddBtn.addEventListener("click", () => {
	let inputName = pEleName[0].value
	let inputCategory = pEleCategory[0].value
	let inputSupplier = pEleSupplier[0].value
	let inputBuyPrice = pEleBuyPrice[0].value
	let inputSellPrice = pEleSellPrice[0].value
	let inputUser = []
	inputUser = { name: inputName, category: inputCategory, supplier: inputSupplier, buyPrice: inputBuyPrice, sellPrice: inputSellPrice }
	insertProduct(inputUser)
	pEleName[0].value = ""
	pEleCategory[0].value = ""
	pEleSupplier[0].value = ""
	pEleBuyPrice[0].value = ""
	pEleSellPrice[0].value = ""
})

// filter

let sSupplier = document.querySelectorAll("#sSupplier")
let sCategory = document.querySelectorAll("#sCategory")
let filterBtn = document.querySelector("#filter")
filterBtn.addEventListener("click", () => {
	// clear hide when click
	let names = []
	let productName = document.querySelectorAll(".name_value_attr")
	productName.forEach(e => {
		names.push({ name: e.innerText, element: e.parentElement })
	})
	names.forEach(n => {
		if (n.element.classList.contains("hide")) {
			n.element.classList.toggle("hide")

		}
		const warning = document.querySelector(".Warning")
		if (warning.classList.contains("show") == true) {
			warning.classList.toggle("show")
		}

	});
	let inputCategory = sCategory[0].value;
	let inputSupplier = sSupplier[0].value;
	let fil = []
	fil = { category: inputCategory, supplier: inputSupplier }
	let formBody = new FormData();
	formBody.append("pSupplier", fil.supplier);
	formBody.append("pCategory", fil.category);
	fetch("/api/filter", {
		method: "POST",
		body: formBody
	})
		.then(statusCheck)
		.then(resp => resp.json())
		.then(filterByCateAndSup)
		.catch(console.log)
})


function filterByCateAndSup(filout) {
	let filName = []
	let names = []
	filout.forEach(e => {
		filName.push({ name: e.productName })
	})
	console.log(filName)
	let productName = document.querySelectorAll(".name_value_attr")
	productName.forEach(e => {
		names.push({ name: e.innerText, element: e.parentElement })
	})
	console.log(names)
	if (filout.length === 0) {
		names.forEach(n => {
			const warning = document.querySelector(".Warning")
			n.element.classList.toggle("hide")
			warning.classList.toggle("show", document.querySelectorAll(".hide").length == document.querySelectorAll(".value_container").length)
		})
	} else {
		let temp = names
		names.forEach(n => {
			n.element.classList.toggle("hide");
		})
		for (let n = 0; n < names.length; n++) {
			console.log(names[n].name)
			for (let i = 0; i < filout.length; i++) {
				console.log(names[n].name)
				if (names[n].name === filout[i].productName) {
					console.log(filout[i].productName)
					names[n].element.classList.toggle("hide")
				}
			}
		}
	}
	// let names = []
	// let fil = []
	// filout.forEach(e => {
	// 	fil.push({ name: e.productName })
	// })
	// let productName = document.querySelectorAll(".name_value_attr")
	// productName.forEach(e => {
	// 	names.push({ name: e.innerText, element: e.parentElement })
	// })
	// if (filout.length === 0) {

	// } else {
	// 	console.log(filout)
	// 	for (let i = 0; i < filout.length; i++) {
	// 		const warning = document.querySelector(".Warning")
	// 		names.forEach(n => {
	// 				}
	// 			}else {
	// 				if(!n.element.classList.contains('hide')) {

	// 				}
	// 			}
	// 		})
	// 	}
	// }


}


function insertProduct(inputUser) {
	console.log(inputUser)
	let count = 0;
	for (let i = 0; i < inputUser.name.length; i++) {
		if (Number.isInteger(+inputUser.name[i])) {
			count++;
		}
	}

	if (inputUser.name == "" || inputUser.category == "" || inputUser.supplier == "" || inputUser.buyPrice == "" || inputUser.sellPrice == "") {
		alert("No attribute can be left blank")
	} else {
		if (inputUser.name.length < 3) {
			alert("the name of the product must have more than two characters")
		} else if (count == inputUser.name.length && inputUser.name.length > 0) {
			alert("the name of product can not be all number")
		} else if (+inputUser.buyPrice < 0 || +inputUser.sellPrice < 0) {
			alert("the price of product can not be negative")
		} else {
			if (confirm("Do you want to add this product to your inventory?")) {
				let formBody = new FormData();
				formBody.append("pName", inputUser.name);
				formBody.append("pCategory", inputUser.category);
				formBody.append("pSupplier", inputUser.supplier);
				formBody.append("buyPrice", inputUser.buyPrice);
				formBody.append("sellPrice", inputUser.sellPrice);
				fetch('/api/insert/new/product', {
					method: "POST",
					body: formBody
				})
					.then(statusCheck)
					.then(resp => resp.text())
					.then(checkResult)
					.catch(console.log)
			}
		}

	}

}

let addCloseButton = document.querySelector(".add_close");
addCloseButton.addEventListener("click", () => {
	let editBtn = document.querySelectorAll("#edit_button")
	editBtn.forEach(e => {
		e.disabled = false
	})
	let deleteBtn = document.querySelectorAll("#delete_button")
	deleteBtn.forEach(e => {
		e.disabled = false
	})
	pEleName[0].value = ""
	pEleCategory[0].value = ""
	pEleSupplier[0].value = ""
	pEleBuyPrice[0].value = ""
	pEleSellPrice[0].value = ""
	addForm.style.display = "none";
})
let addCancelButton = document.querySelector("#cancel_add_button");
addCancelButton.addEventListener("click", () => {
	let editBtn = document.querySelectorAll("#edit_button")
	editBtn.forEach(e => {
		e.disabled = false
	})
	let deleteBtn = document.querySelectorAll("#delete_button")
	deleteBtn.forEach(e => {
		e.disabled = false
	})
	pEleName[0].value = ""
	pEleCategory[0].value = ""
	pEleSupplier[0].value = ""
	pEleBuyPrice[0].value = ""
	pEleSellPrice[0].value = ""
	addForm.style.display = "none";
})

// edit product function
let okEditBtn = document.querySelector("#ok_edit_button")
okEditBtn.addEventListener("click", () => {
	let inputID = pID
	let inputName = pEleName[1].value
	let inputCategory = pEleCategory[1].value
	let inputSupplier = pEleSupplier[1].value
	let inputBuyPrice = pEleBuyPrice[1].value
	let inputSellPrice = pEleSellPrice[1].value
	let inputUser = []
	inputUser = { id: inputID, name: inputName, category: inputCategory, supplier: inputSupplier, buyPrice: inputBuyPrice, sellPrice: inputSellPrice }
	editProduct(inputUser)
	pEleName[1].value = ""
	pEleCategory[1].value = ""
	pEleSupplier[1].value = ""
	pEleBuyPrice[1].value = ""
	pEleSellPrice[1].value = ""
})

function editProduct(inputUser) {
	let count = 0;
	for (let i = 0; i < inputUser.name.length; i++) {
		if (Number.isInteger(+inputUser.name[i])) {
			count++;
		}
	}

	if (inputUser.name == "" && inputUser.category == "" && inputUser.supplier == "" && inputUser.buyPrice == "" && inputUser.sellPrice == "") {
		alert("All attributes cannot be left blank")
	} else if (inputUser.name.length < 3 && inputUser.name.length != 0) {
		alert("the name of the product must have more than two characters")
	} else if (count == inputUser.name.length && inputUser.name.length > 0) {
		alert("the name of product can not be all number")
	} else if (+inputUser.buyPrice < 0 || +inputUser.sellPrice < 0) {
		alert("the price of product can not be negative")
	}
	else {
		let productID = +inputUser.id
		let pName
		let pCategory
		let pSupplier
		let buyPrice
		let sellPrice
		if (inputUser.name == "") {
			pName = thisName
		} else {
			pName = inputUser.name
		}
		if (inputUser.category == "") {
			pCategory = thisCategory
		} else {
			pCategory = inputUser.category
		}
		if (inputUser.supplier == "") {
			pSupplier = thisSupplier
		} else {
			pSupplier = inputUser.supplier
		}
		if (inputUser.buyPrice == "") {
			buyPrice = +thisBuyPrice
		} else {
			buyPrice = +inputUser.buyPrice
		}
		if (inputUser.sellPrice == "") {
			sellPrice = +thisSellPrice
		} else {
			sellPrice = +inputUser.sellPrice
		}
		if (confirm("do you want to edit this product?")) {
			let formBody = new FormData();
			formBody.append("productID", productID);
			formBody.append("pName", pName);
			formBody.append("pCategory", pCategory);
			formBody.append("pSupplier", pSupplier);
			formBody.append("buyPrice", buyPrice);
			formBody.append("sellPrice", sellPrice);
			fetch('/api/edit/product', {
				method: "POST",
				body: formBody
			})
				.then(statusCheck)
				.then(resp => resp.text())
				.then(checkResult)
				.catch(console.log)
		}

	}

}

let editCloseButton = document.querySelectorAll(".edit_close");
editCloseButton.forEach(e => {
	e.addEventListener("click", () => {
		let editBtn = document.querySelectorAll("#edit_button")
		editBtn.forEach(e => {
			e.disabled = false
		})
		let deleteBtn = document.querySelectorAll("#delete_button")
		deleteBtn.forEach(e => {
			e.disabled = false
		})
		let addBtn = document.querySelector(".add_new_item");
		addBtn.disabled = false
		pEleName[1].value = ""
		pEleCategory[1].value = ""
		pEleSupplier[1].value = ""
		pEleBuyPrice[1].value = ""
		pEleSellPrice[1].value = ""
		editForm.style.display = "none";
	})
});

// delete product function
function deleteProduct(productID) {
	if (confirm("do you want to delete this product")) {
		let formBody = new FormData();
		formBody.append("productID", productID);
		fetch('/api/delete/product', {
			method: "POST",
			body: formBody
		})
			.then(statusCheck)
			.then(resp => resp.text())
			.then(checkResult)
			.catch(console.log)
	}
}

// get category, supplier function

let suppliers = []
let categories = []


function getSuppInfo(rows) {
	rows.forEach(r => {
		suppliers.push(r)
	});

	let showSupplier = document.querySelectorAll("#supplier")
	let supFilter = document.querySelectorAll("#sSupplier")
	let temp = "";

	suppliers.forEach(s => {
		temp += " <option value=\"" + s.supplierName + "\">" + s.supplierName + "</option>\n "
	});
	console.log(temp)
	showSupplier.forEach(sup => {
		sup.innerHTML += temp
	});
	supFilter.forEach(sup => {
		sup.innerHTML += temp
	});

}
function getCateInfo(rows) {
	rows.forEach(r => {
		categories.push(r)
	});
	let showCategory = document.querySelectorAll("#category")
	let filSup = document.querySelectorAll("#sCategory")
	let temp = "";
	categories.forEach(c => {
		temp += " <option value=\"" + c.categoryName + "\">" + c.categoryName + "</option>\n "
	});
	showCategory.forEach(cate => {
		cate.innerHTML += temp
	});
	filSup.forEach(cate => {
		cate.innerHTML += temp
	});

}

// add or reduce quantity
function changeQuantity(e){
	console.log(e)
}

function checkResult(a) {
	alert(a)
	location.reload()
}
async function statusCheck(res) {
	if (!res.ok) {
		throw new Error(await res.text());
	}
	return res;
}