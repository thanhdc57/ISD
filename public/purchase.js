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
  

  document.addEventListener("click", function (e) {
    targetElement = e.target;
    classList = targetElement.classList;
  
    //add new product report
    if (targetElement.id === "purchaseProductBtn") {
      let productForm = document.getElementById("purchaseProductList");
      productForm.insertAdjacentHTML("beforeend",form)
      const selectOption = document.querySelectorAll(".select-option");
      const optionSearch = document.querySelectorAll("#optionSearch");
      const optionList = document.querySelectorAll(".options li");
  
      console.log(selectOption);
      selectOption.forEach(e => {
        e.addEventListener("click", function () {
              e.parentElement.classList.toggle("active");
            
        });
      });
    
  
      optionList.forEach(function (optionListSingle) {
        optionListSingle.addEventListener("click", function () {
          text = this.textContent;
          let selectBox = optionListSingle.parentElement.parentElement.parentElement
          console.log(selectBox.firstElementChild.firstElementChild.value)
          selectBox.firstElementChild.firstElementChild.value = text
         selectBox.classList.remove("active");
        });
      });
      
      optionSearch.forEach(e => {
           e.addEventListener("keyup", function () {
        let filter, li, i, textValue;
        filter = e.value.toUpperCase();
        li = e.parentElement.parentElement.lastElementChild.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
          liCount = li[i];
          textValue = liCount.textContent || liCount.innerText;
          if (textValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "list-item";
          } else {
            li[i].style.display = "none";
          }
        }
      });
      });
   
    }
  
    //remove button
    if (targetElement.classList.contains("removeBtn")) {
      let orderRow = targetElement.closest("div.purchaseProductRow");
      let text = "You want to remove the product report?";
      if (confirm(text) == true) {
        orderRow.remove();
      }
    }
  });
  
  let form =
    '\
    <div class="purchaseProductRow">\
              <div style="padding: 10px">\
                  <label for="product_quanity">Category: </label>\
                  <select name="product_category" class="productSelect" id="product">\
                      <option value="">Select one...</option>\
                      <option value="">but</option>\
                      <option value="">sach</option>\
                       <option value="">vo</option>\
                       </select>\
              </div>\
              <div style="padding: 10px">\
                  <label for="product_quanity">Supplier: </label>\
                  <select name="product_category" class="productSelect" id="product" >\
                      <option value="">Select one...</option>\
                      <option value="">thien long</option>\
                      <option value="">hong ha</option>\
                      <option value="">kim dong</option>\
                  </select>\
                  <button class="removeBtn">Remove</Button>\
              </div>\
              <label style="padding: 10px; font-size:15px" for="product_name">Product Name: </label>\
              <div style="padding: 10px" class="select-box">\
                  <div class="select-option">\
                    <input type="text" placeholder="Select product name" id="soValue" readonly name="" value ="ưẻ" />\
                  </div>\
                  <div class="content">\
                    <div class="search">\
                      <input type="text" id="optionSearch" placeholder="Search..." name="" />\
                    </div>\
                    <ul class="options">\
                      <li>HTML</li>\
                      <li>CSS</li>\
                      <li>JS</li>\
                    </ul>\
                  </div>\
              </div>\
              <div style="padding: 10px">\
                  <label for="product_quanity">Quantity: </label>\
                          <input \
                          type="number"\
                          class="appFormInput"\
                          id="prouduct_quanityr"\
                          placeholder="Enter product quantity..."\
                          name="product_quanity"/>\
              </div>\
      </div>';
  