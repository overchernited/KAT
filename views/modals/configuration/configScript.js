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

function variableChangeHandler(slider) {
  var variableToChange = slider.dataset.variable;

  storageSliderValue(variableToChange, slider.checked);
}

function storageSliderValue(variableToChange, newValue) {
  configs[variableToChange] = newValue;
  localStorage.setItem(variableToChange, newValue);
}




recoverConfigs();
