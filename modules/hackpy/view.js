const PushModal = document.getElementById("modalcontent");

const configTemplate = `
<p id="title">HACK PY</p>
<form id="hackpy">
    <div id="clientsContainer">

    </div>
    <div id="controls">
      <input type="text" id="command" name="command" placeholder="Command">
      <button id="submitCommand" type="button"><i class="fa-solid fa-play"></i></button>
    </div>
</form>
<script>
    
</script>`;


PushModal.innerHTML += configTemplate;
