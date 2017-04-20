   var menu = document.getElementById('menu');
        var drawer = document.getElementById('drawer');
        menu.addEventListener('click', function(e) {
            drawer.classList.toggle('open');
            e.stopPropagation();
        });