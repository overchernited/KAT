const PushModal = document.getElementById("modalcontent");

const configTemplate = `<form id="hackpy">
    <p>HACK PY</p>
    <input type="text" id="command" name="command" placeholder="Command">
    <input type="text" id="client" name="client" placeholder="# of client">
    <button id="submitCommand" type="button"><i class="fa-solid fa-play"></i></button>
</form>
<script>
    
</script>`;

loadCSS("../modules/hackpy/main.css");
PushModal.innerHTML += configTemplate;
