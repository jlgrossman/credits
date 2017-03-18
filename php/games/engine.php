<?

function getFiles($gameName) {
  echo "<link href=\"/styles/games/$gameName/styles.css\" rel=\"stylesheet\"/>
        <script src=\"/scripts/utils.js\"></script>
        <script src=\"/scripts/games/$gameName/app.js\"></script>";
}

?>
