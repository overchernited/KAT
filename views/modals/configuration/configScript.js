scrollRange = document.getElementById("scrollzonerange");
rangeParagraph = document.getElementById("rangeParagraph");
checkboxes = document.querySelectorAll(".checkbox");

function changueAutoScrollZone() {
  let scrollvalue = scrollRange.value;
  rangeParagraph.innerHTML = scrollvalue + "px";
  scrollvalue = parseInt(scrollvalue, 10);
  configs["scrollZoneSize"] = scrollvalue;
  localStorage.setItem("scrollZoneSize", scrollvalue);
  console.log(configs["scrollZoneSize"]);
}

function soundChangeHandler(slider) {
  var variableToChange = slider.dataset.variable;

  changeSoundValue(variableToChange, slider.checked);
  console.log("Cambio en", variableToChange + ":", configs[variableToChange]);
}

function changeSoundValue(variableToChange, newValue) {
  configs[variableToChange] = newValue;
  localStorage.setItem(variableToChange, newValue);
}




recoverConfigs();
