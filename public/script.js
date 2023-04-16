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
